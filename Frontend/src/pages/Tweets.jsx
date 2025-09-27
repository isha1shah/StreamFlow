import React, { useEffect, useState } from "react";
import { getAllTweets, createTweet, deleteTweet } from "../api/tweet";
import TweetCard from "../components/TweetCard";

export default function TweetsPage() {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTweets = async () => {
    try {
      const res = await getAllTweets();
      setTweets(res.data?.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleCreate = async () => {
    if (!newTweet.trim()) return;
    try {
      await createTweet({ content: newTweet });
      setNewTweet("");
      fetchTweets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTweet(id);
      fetchTweets();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <textarea
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          placeholder="What's happening?"
          className="w-full border rounded p-2 mb-2"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tweet
        </button>
      </div>

      <div>
        {tweets.length === 0 ? (
          <p className="text-gray-500">No tweets yet</p>
        ) : (
          tweets.map((t) => <TweetCard key={t._id} tweet={t} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  );
}

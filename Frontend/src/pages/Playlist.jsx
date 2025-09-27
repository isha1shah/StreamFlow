import React, { useEffect, useState } from "react";
import { getUserPlaylists, createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist } from "../api/playlist";

export default function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [title, setTitle] = useState("");

  const loadPlaylists = async () => {
    try { const res = await getUserPlaylists(); setPlaylists(res.data?.data || []); }
    catch (err) { console.error(err); }
  };

  useEffect(() => { loadPlaylists(); }, []);

  const handleCreate = async () => {
    if (!title) return;
    try { await createPlaylist({ title }); setTitle(""); loadPlaylists(); } catch (err) { console.error(err); }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Playlists</h2>
      <div className="flex gap-2 mb-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New Playlist" className="border p-2 rounded flex-1"/>
        <button onClick={handleCreate} className="bg-green-600 text-white px-3 py-1 rounded">Create</button>
      </div>
      <ul className="space-y-2">
        {playlists.map(p => <li key={p._id} className="border p-2 rounded">{p.title}</li>)}
      </ul>
    </div>
  );
}

# StreamFlow - YouTube Clone

A full-stack MERN project that allows users to upload, watch, like, and comment on videos. Built with **MongoDB, Express, React, and Node.js**.

## Features

- User registration and authentication (JWT)
- Upload videos and thumbnails
- Update user profile, avatar, and cover image
- Watch history tracking
- Like and comment on videos
- Channel dashboard with stats and liked videos
- Responsive and modern UI

## Live Demo

- **Frontend:** [StreamFlow Frontend](https://isha1shah.github.io/StreamFlow)  
- **Backend API:** [StreamFlow Backend](https://streamflow-production-93a6.up.railway.app/api/v1)

## Installation (Local Development)

1. Clone the repository:

```bash
git clone https://github.com/isha1shah/StreamFlow.git
install Backend dependencies:

2.Install Backend dependencies:
cd Backend
npm install

3.Create a .env file in Backend with required environment variables.
PORT=5000
MONGODB_URI=<Your MongoDB URI>
ACCESS_TOKEN_SECRET=<Your JWT secret>
REFRESH_TOKEN_SECRET=<Your JWT secret>
CORS_ORIGIN=*
CLOUDINARY_CLOUD_NAME=<Your Cloudinary cloud name>
CLOUDINARY_API_KEY=<Your Cloudinary API key>
CLOUDINARY_API_SECRET=<Your Cloudinary API secret>

4.Run Backend locally:
npm run dev

5.Navigate to frontend folder:
cd ../Frontend

6.Install dependencies:
npm install

7.Update API base URL in your frontend code (e.g., axiosInstance.js):
baseURL: "http://localhost:8000/api/v1"

8.For live backend testing, use:
const BASE_URL = "https://streamflow-production-93a6.up.railway.app/api/v1";

9.Run frontend locally:
npm run dev





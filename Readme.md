# StreamFlow 

A MERN stack project that mimics the functionality of YouTube. Users can register, login, upload videos, view video lists, and interact with content.  

## Features

- User authentication (JWT-based)
- Upload and view videos
- Search videos
- Responsive UI built with React + TailwindCSS
- Backend with Node.js, Express, MongoDB
- Cloudinary integration for media uploads

## Live Demo

- **Frontend:** [https://isha1shah.github.io/StreamFlow](https://isha1shah.github.io/StreamFlow)  
- **Backend API:** [https://streamflow-f8ep.onrender.com/api/v1](https://streamflow-f8ep.onrender.com/api/v1)

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
baseURL: "http://localhost:5000/api/v1"

8.For live backend testing, use:
baseURL: "https://streamflow-f8ep.onrender.com/api/v1"

9.Run frontend locally:
npm run dev





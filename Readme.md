# Video Sharing Platform Backend

This is a feature-rich backend for a video-sharing and subscription-based platform, inspired by platforms like YouTube. It is built using **Node.js**, **Express.js**, and **MongoDB**, with secure authentication, media upload, and user interaction capabilities.

---

## 🔧 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (Access & Refresh Tokens), bcrypt
* **File Uploads:** Multer, Cloudinary
* **Security:** Cookie-based auth, httpOnly tokens
* **Others:** dotenv, cookie-parser, CORS, custom middlewares

---

## 📁 Project Structure

```
├── controllers
│   └── user.controller.js
├── models
│   ├── user.model.js
│   ├── video.model.js
│   └── subscription.model.js
├── middlewares
│   ├── auth.middleware.js
│   └── multer.middleware.js
├── routes
│   └── user.routes.js
├── utils
│   ├── asyncHandler.js
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── cloudinary.js
├── config
│   └── db.js
├── app.js
├── index.js
├── .env
└── README.md
```

---

## 🚀 Features

### ✅ Authentication & Authorization

* User registration and login with JWT (access + refresh tokens)
* Secure password hashing with bcrypt
* Cookie-based token storage
* Protected routes using middleware

### 📸 Media Uploads

* Avatar and cover image uploads using Multer
* Cloudinary integration for media storage
* Video model with cloud URL support

### 👤 User Features

* Update profile, avatar, and cover image
* Change password after verifying old password
* Fetch own data securely

### 📺 Channel System

* Follow/unfollow users via Subscription model
* Fetch public channel data via aggregation pipeline
* See subscriber and following counts
* Detect if current user is subscribed

---

## 📦 Installation

1. **Clone the repo**

```bash
git clone https://github.com/NimeeshB/Backend.git
cd Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Add your environment variables**
   Create a `.env` file at the root with the following:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=videoshare
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
CORS_ORIGIN=http://localhost:3000
```

4. **Start the server**

```bash
npm run dev
```

---

## 🔌 API Endpoints (User)

| Method | Endpoint                      | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| POST   | /api/v1/users/register        | Register a new user (avatar + cover image) |
| POST   | /api/v1/users/login           | Login and receive tokens                   |
| POST   | /api/v1/users/logout          | Logout user (clears cookies)               |
| POST   | /api/v1/users/refreshToken    | Refresh access token                       |
| GET    | /api/v1/users/\:username      | Get public channel info                    |
| GET    | /api/v1/users/me              | Get current user profile                   |
| PUT    | /api/v1/users/change-password | Change current password                    |
| PATCH  | /api/v1/users/update-profile  | Update fullName and email                  |
| PATCH  | /api/v1/users/avatar          | Update avatar image                        |
| PATCH  | /api/v1/users/cover-image     | Update cover image                         |

> More endpoints for video and subscription routes coming soon.

---

## 📌 Notes

* Built using best practices: async error handling, modular controllers, clean separation of concerns
* Aggregation pipeline used for performance-optimized channel queries
* Subscriptions designed using referenced Mongoose schemas for scalability

---

## ✨ Future Improvements

* Video upload and streaming support
* Comments and likes system
* Notification service
* Analytics dashboard

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---



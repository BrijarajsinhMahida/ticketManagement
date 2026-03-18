# Ticket Management System

Interactive Ticket Management System built with Node.js, Express, React, and Redux. Features glassmorphism UI, real-time filtering, search, and pagination.

## 🚀 Features

### **Backend**
- **Node.js & Express**: Scalable RESTful API infrastructure.
- **MongoDB & Mongoose**: Efficient data modeling for Tickets and Users.
- **RBAC (Role-Based Access Control)**:
  - **Admins**: Full control over users and tickets.
  - **Employees**: Can manage assigned tickets, update status, and **re-assign tickets to other users**.
- **Pagination**: Server-side pagination for large datasets.
- **Filtering & Search**: Dynamic filtering by status/priority and title search.
- **Swagger Documentation**: Interactive API documentation at `/api-docs`.

### **Frontend**
- **React & Redux Toolkit**: Robust state management and dynamic UI.
- **Glassmorphism Design**: Premium, modern interface using Vanilla CSS.
- **Responsive Layout**: Works seamlessly across mobile, tablet, and desktop.
- **Lucide Icons**: High-quality SVG icons for better visual feedback.

---

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, React Router, Axios, Lucide-React
- **Backend**: Node.js, Express, Mongoose, Swagger, CORS, Dotenv
- **Database**: MongoDB

---

## 💻 Getting Started

### **Prerequisites**
- Node.js (v16+)
- MongoDB (running locally or a cloud instance)

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ticket_management
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/ticket_management_system
     JWT_SECRET=supersecretkey123
     JWT_EXPIRE=30d
     NODE_ENV="Development"
     ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🏃 Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   # Development mode (with nodemon)
   npm run dev
   ```
   *Server will run at `http://localhost:5000`*
   *Swagger docs available at `http://localhost:5000/api-docs`*
   *Note: On first run, a default admin is seeded: `admin@test.com` / `password123`*

2. **Start the Frontend Dev Server:**
   ```bash
   cd ../frontend
   npm run dev
   ```
   *App will run at `http://localhost:5173` (or the port specified by Vite)*

---

## 📖 API Documentation

The API is fully documented using Swagger. Once the backend is running, visit:
`http://localhost:5000/api-docs`

---

## 📂 Project Structure

```text
ticket_management/
├── backend/            # Express Server
│   ├── config/         # Database configuration & seeders
│   ├── controllers/    # Route controllers (logic)
│   ├── models/         # Mongoose schemas (data)
│   ├── routes/         # API endpoints (routing)
│   ├── middleware/     # Auth & validation middleware
│   └── server.js       # Main entry point
├── frontend/           # React Application
│   ├── src/
│   │   ├── api/        # Axios API configurations
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages (views)
│   │   ├── store/      # Redux Toolkit (state management)
│   │   └── App.jsx     # Main application component
│   └── index.css       # Global styles (Vanilla CSS)
└── README.md           # Setup & usage guide
```


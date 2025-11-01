# ABC General Store


ABC General Store (Shoporia concept)

This project was built as a concept for "ABC General Store". All branding, UI, and features are tailored to match the client brief. Shoporia is the original codebase, adapted for ABC General Store branding.

ABC General Store is a full-stack e-commerce web application built with React (frontend) and Express/MongoDB (backend). It features user authentication, product management, cart, orders, payments, and an admin dashboard.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Folder Overview](#folder-overview)
- [License](#license)

---

## Features
- User registration, login, profile management
- Product listing, details, reviews, and ratings
- Cart and checkout flow
- Order management and payment integration
- Admin dashboard for managing products, users, orders, and reviews
- Responsive UI with modern design

---

## Tech Stack
**Frontend:**
- React
- Vite
- Redux Toolkit
- Axios
- CSS Modules

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (for image uploads)
- Nodemailer (for emails)
- Stripe/other payment integration

---

## Project Structure
```
Shoporia/
  backend/
    app.js
    server.js
    .env
    config/
    controller/
    middleware/
    models/
    routes/
    utils/
  frontend/
    src/
    public/
    index.html
    package.json
    README.md
    vite.config.js
  package.json
  .gitignore
```

---

## Setup Instructions
### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- Stripe or other payment provider keys

### 1. Clone the repository
```sh
git clone https://github.com/Shanidhya01/Shoporia.git
cd Shoporia
```

### 2. Install dependencies
#### Backend
```sh
npm install
```
#### Frontend
```sh
cd ../frontend
npm install
```

### 3. Configure environment variables
Create a `.env` file in `backend/` with the following (example):
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 4. Start the backend server
```sh
npm run dev
```

### 5. Start the frontend development server
```sh
cd ../frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

---

## Scripts
### Backend
- `npm start` — Start the Express server
- `npm run dev` — Start with nodemon for development

### Frontend
- `npm run dev` — Start Vite development server
- `npm run build` — Build for production

---

## Folder Overview
### Backend
- `app.js` — Express app setup
- `server.js` — Server entry point
- `config/` — Database and other config files
- `controller/` — Route controllers (user, product, order, payment)
- `middleware/` — Auth and other middleware
- `models/` — Mongoose models
- `routes/` — Express route definitions
- `utils/` — Utility functions (API features, JWT, email, etc.)

### Frontend
- `src/` — Main React source code
  - `Admin/` — Admin dashboard components
  - `Cart/` — Cart and checkout components
  - `Order/` — Order management components
  - `Pages/` — Main pages (Home, Products, ProductDetails)
  - `User/` — User authentication and profile components
  - `components/` — Shared UI components
  - `features/` — Redux slices for state management
- `public/` — Static assets

---

## License
This project is licensed under the MIT License.

---

Feel free to customize this README further for deployment, contributing, or API documentation!

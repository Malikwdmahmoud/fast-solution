# Fast-Solution Backend

Backend server for Fast-Solution website built with Node.js, Express, and MongoDB.

## Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up MongoDB (local or cloud).

4. Update .env with your MongoDB URI and JWT secret.

5. Run the server:
   ```
   npm start
   ```

   For development:
   ```
   npm run dev
   ```

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/contact - Submit contact form
- POST /api/store/order - Place an order
- GET /api/store/orders - Get all orders (admin)

## Connecting to Frontend

Update the frontend JavaScript files (e.g., service-form.js, store.js) to make API calls to `http://localhost:5000/api/...`
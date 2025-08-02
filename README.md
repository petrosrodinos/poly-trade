# Trading Bot API

A Node.js Express API with TypeScript for trading bot functionality with Twitter integration for market analysis.

## Project Structure

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── routes/          # Route definitions
├── dto/            # Data Transfer Objects
└── index.ts        # Application entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
PORT=3000
NODE_ENV=development
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check

- `GET /health` - Health check endpoint

## Example Usage

### Create a user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe"}'
```

### Get all users
```bash
curl http://localhost:3000/api/users
```

## Technologies Used

- Express.js
- TypeScript
- Zod (validation)
- Helmet (security)
- CORS
- Morgan (logging) # trading-bot

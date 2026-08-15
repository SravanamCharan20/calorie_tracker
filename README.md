# Calorie Tracker

A full-stack personal nutrition app that helps you log meals, track daily and weekly intake, set goals, and get AI-powered help with food logging and nutrition questions.

Each user has their own account and data. After signing in, you can manage meals, view dashboard analytics, update your targets, scan food images for nutrition estimates, import meals from a PDF, and chat with an AI assistant that can log meals and summarize your week.

---

## Features

### Authentication
- Sign up with username, email, and password
- Sign in and sign out
- JWT stored in an HTTP-only cookie
- Protected routes for dashboard, meals, goals, and chat

### Dashboard
- Today’s calorie progress against your daily target
- Goal vs actual comparison for calories, protein, carbs, and fat
- Weekly calories chart for the last 7 days
- Macro breakdown with daily and weekly views
- Micronutrient summary (iron, calcium, vitamin C, vitamin D)
- Recent meals for the current day

### Meals
- Create, edit, and delete meals
- Meal types: breakfast, lunch, dinner, snacks
- Track calories, protein, carbs, fat, and micronutrients
- Filter by meal type and date range
- Search by food name
- Paginated meal list (10 meals per page)
- Bulk import from PDF
- AI image extraction when adding a meal (upload a food photo or label to pre-fill nutrition fields)

### Goals
- View and update daily calorie, protein, carb, and fat targets
- Set a weight goal
- A default goal is created automatically when you sign up

### AI Chat
- Ask general nutrition questions
- Log meals in natural language (for example: “Log 2 eggs for breakfast”)
- Check your personal goals
- Get a summary of meals from the last 7 days
- Powered by Gemini with tool calling for meal logging, goals, and weekly summaries

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT, bcrypt, HTTP-only cookies |
| AI | Google Gemini (`@google/genai`) |

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** (v18 or newer recommended)
- **MongoDB** (local install or MongoDB Atlas)
- **Google Gemini API keys** for:
  - Food image extraction
  - Chat assistant

---

## Project Structure

```
Calorie_tracker/
├── backend/          # Express API
│   ├── routes/       # auth, meals, goals, ai, chat
│   ├── models/       # User, Meal, Goal
│   ├── config/       # DB, Gemini, chat tools
│   └── utils/        # PDF meal parser
├── frontend/         # React app
│   └── src/
│       ├── pages/    # Dashboard, Meals, Goals, Chat, Auth
│       ├── components/
│       └── services/ # API calls
└── samples/          # Sample PDF/CSV for bulk import
```

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside the `backend` folder:

```env
MONGO_URL=mongodb://127.0.0.1:27017/calorie_tracker
JWT_SECRET=your_long_random_secret_here
GEMINI_API_KEY=your_gemini_api_key_for_image_extraction
GEMINI_CHAT_API_KEY=your_gemini_api_key_for_chat
PORT=6969
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign auth tokens |
| `GEMINI_API_KEY` | Yes | Used by `POST /ai/extract` for food image analysis |
| `GEMINI_CHAT_API_KEY` | Yes | Used by the chat assistant |
| `PORT` | No | API port (default: `6969`) |
| `NODE_ENV` | No | Set to `production` in production for secure cookies |

You can use the same Gemini key for both AI features if your quota allows it.

### Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend` folder:

```env
VITE_BASE_URL=http://localhost:6969
```

This tells the frontend where the backend API is running.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Calorie_tracker
```

### 2. Start MongoDB

If you use a local MongoDB instance, make sure it is running before starting the backend.

For MongoDB Atlas, copy your connection string into `MONGO_URL` in `backend/.env`.

### 3. Install and run the backend

```bash
cd backend
npm install
npm run dev
```

The API runs at **http://localhost:6969**.

### 4. Install and run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**.

### 5. Open the app

1. Go to **http://localhost:5173**
2. Create an account on the sign-up page
3. Sign in
4. Set your goals on the **Goals** page
5. Start logging meals on the **Meals** page or through **Chat**

---

## How to Use the App

### Logging a meal manually
1. Open **Meals**
2. Click **Add meal**
3. Fill in food name, quantity (in grams), meal type, macros, and optional micronutrients
4. Save

### Logging a meal with AI image scan
1. Open **Meals** → **Add meal**
2. Upload a food photo or nutrition label
3. The app sends the image to Gemini and pre-fills the form
4. Review the values, adjust if needed, and save

### Bulk importing meals from PDF
1. Open **Meals**
2. Click **Bulk upload**
3. Upload a PDF with meal rows
4. Download the sample file from the modal if you need a reference format

The PDF parser supports pipe-separated (`|`), comma-separated, or tab-separated rows with headers such as:

`meal type | food name | quantity | calories | protein | carbs | fat`

Sample files:
- `samples/meals-import-sample.pdf`
- `frontend/public/samples/meals-import-sample.pdf`

### Using the chat assistant
1. Open **Chat**
2. Try a suggested prompt or type your own message
3. Examples:
   - “Log 2 eggs for breakfast”
   - “What are my calorie goals?”
   - “Summarize my meals this week”

The assistant can create meals, fetch your goals, and summarize your last 7 days of logged meals.

### Viewing your dashboard
Open **Dashboard** to see today’s intake, weekly trends, macro breakdown, micronutrients, goal comparison, and recent meals.

---

## API Overview

All protected routes require a valid auth cookie from sign-in.

### Auth — `/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create account |
| POST | `/signin` | Sign in |
| POST | `/logout` | Sign out |
| GET | `/me` | Get current user |

### Goals — `/goals`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/get` | Get user goals |
| PATCH | `/update` | Update goals |

### Meals — `/meals`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a meal |
| GET | `/get` | List meals (supports `page`, `limit`, `mealType`, `startDate`, `endDate`, `search`) |
| GET | `/get/:id` | Get one meal |
| PATCH | `/update/:id` | Update a meal |
| DELETE | `/delete/:id` | Delete a meal |
| POST | `/import/pdf` | Bulk import from PDF |

### AI — `/ai`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/extract` | Extract nutrition from a food image |

### Chat — `/chat`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Send a chat message |

---

## Scripts

### Backend
```bash
npm run dev    # Start with nodemon
npm start      # Start in production mode
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Notes

- **Quantity is stored as a number (grams)** in the database. When logging through chat or AI, use numeric quantities for best results.
- **Date filtering** uses your local timezone on the frontend when sending date ranges to the API.
- **CORS** is configured for `http://localhost:5173` during development.
- **Chat sessions are stateless** — each message is handled independently without long-term conversation memory on the server.
- AI features require valid Gemini API keys and depend on model availability.

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Frontend cannot reach API | Confirm `VITE_BASE_URL` matches the backend URL and the backend is running |
| Auth not working | Check `JWT_SECRET` is set and cookies are allowed in the browser |
| Database connection failed | Verify MongoDB is running and `MONGO_URL` is correct |
| AI extract or chat fails | Confirm Gemini API keys are valid and have available quota |
| PDF import fails | Use the sample PDF format and make sure rows include required columns |

---

## License

ISC

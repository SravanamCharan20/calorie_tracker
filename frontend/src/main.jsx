import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { AuthProvider } from "./utils/AuthContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import GuestRoute from "./components/auth/GuestRoute.jsx";

import Signup from "./pages/auth/Signup.jsx";
import Signin from "./pages/auth/Signin.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Meals from "./pages/meals/Meals.jsx";
import Goals from "./pages/goals/Goals.jsx";
import Chat from "./pages/chat/Chat.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/signup",
        element: (
          <GuestRoute>
            <Signup />
          </GuestRoute>
        ),
      },
      {
        path: "/signin",
        element: (
          <GuestRoute>
            <Signin />
          </GuestRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/meals",
        element: (
          <ProtectedRoute>
            <Meals />
          </ProtectedRoute>
        ),
      },
      {
        path: "/goals",
        element: (
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Signup from "./pages/auth/Signup.jsx";
import Signin from "./pages/auth/Signin.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/signup",
        Component: Signup,
      },
      {
        path: "/signin",
        Component: Signin,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

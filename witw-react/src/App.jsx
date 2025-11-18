import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AddActivity from "./pages/AddActivity";
import Mapa from "./pages/MapPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "perfil", element: <Profile /> },
        { path: "add", element: <AddActivity /> },
        { path: "mapa", element: <Mapa /> },
      ],
    },

    // Rutas sin navbar
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

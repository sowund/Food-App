import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login";
import Home from "./components/Home";

function App() {
  
  // 1. Create a Wrapper to check auth dynamically
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    // If token exists, show the children (Home); otherwise, go to Login
    return token ? children : <Navigate to="/login" />;
  };

  // 2. Create a Wrapper to prevent logged-in users from seeing Login page
  const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? <Navigate to="/home" /> : children;
  };

  return (
    <Routes>

      {/* Default Page: Redirect to Home (which will handle auth check) */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Login Page: Only accessible if NOT logged in */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Food Page: Only accessible if logged in */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />

    </Routes>
  );
}

export default App;
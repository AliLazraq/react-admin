import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

import LoginPage from "./components/Authentication/LoginPage";
import RegistrationPage from "./components/Authentication/RegistrationPage";
import Dashboard from "./scenes/dashboard";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Maintenance from "./scenes/maintenance";
import Predictions from "./scenes/prediction";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Progress from "./scenes/progress";
import Bar from "./scenes/bar";
import Geofence from "./scenes/geofence";
import GPS from "./scenes/gps";

const App = () => {
  const { colorMode, theme } = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app"> 
            {isAuthenticated && <Sidebar />}
            <main className="content" style={{ flex: 1, overflowY: "auto" }}>
              {isAuthenticated && <Topbar onLogout={handleLogout} />}
              <Routes>
                {/* Public Routes */}
                {!isAuthenticated && (
                  <>
                    <Route
                      path="/login"
                      element={<LoginPage onLogin={handleLogin} />}
                    />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                  </>
                )}

                {/* Protected Routes */}
                {isAuthenticated && (
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/prediction" element={<Predictions />} />
                    <Route path="/form" element={<Form />} />
                    <Route path="/line" element={<Bar />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/bar" element={<Line />} />
                    <Route path="/geofence" element={<Geofence />} />
                    <Route path="/gps" element={<GPS />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </>
                )}
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
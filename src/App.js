//I still can't see team management on the dashboard
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Predictions from "./scenes/prediction";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geofence from "./scenes/geofence";
import GPS from "./scenes/gps";

function App() {
  const { colorMode, theme } = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}> 
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/prediction" element={<Predictions />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Line />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Bar />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/geofence" element={<Geofence />} />
              <Route path="/gps" element={<GPS />} />
            </Routes> 
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>

  );
}

export default App;

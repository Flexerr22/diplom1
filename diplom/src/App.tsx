import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main/Main";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import Chats from "./pages/Chats/Chats";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/businessman" element={<ProjectPage />} />

        <Route path="/mentor" element={<ProjectPage />} />

        <Route path="/investor" element={<ProjectPage />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </Router>
  );
}

export default App;

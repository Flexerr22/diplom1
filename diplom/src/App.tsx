import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main/Main";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import Chats from "./pages/Chats/Chats";
import { CreateProject } from "./pages/CreateProject/CreateProject";
import { ProjectById } from "./components/ProjectById/ProjectById";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />

        <Route path="/mentor" element={<ProjectPage />} />

        <Route path="/investor" element={<ProjectPage />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/add" element={<CreateProject />} />
        <Route path="/project/:project_id" element={<ProjectById />} />
      </Routes>
    </Router>
  );
}

export default App;

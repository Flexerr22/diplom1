import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main/Main";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import Chats from "./pages/Chats/Chats";
import { CreateProject } from "./pages/CreateProject/CreateProject";
import { ProjectById } from "./components/ProjectById/ProjectById";
import MentorPage from "./pages/MentorPage/MentorPage";
import InvestorPage from "./pages/InvestorPage/InvestorPage";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { MyProjects } from "./pages/MyProjects/MyProjects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />

        <Route path="/mentor" element={<MentorPage />} />

        <Route path="/investor" element={<InvestorPage />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/add" element={<CreateProject />} />
        <Route path="/project/:project_id" element={<ProjectById />} />
        <Route path="/user/:user_id" element={<UserInfo />} />
        <Route path="/my-projects/:user_id" element={<MyProjects />} />
      </Routes>
    </Router>
  );
}

export default App;

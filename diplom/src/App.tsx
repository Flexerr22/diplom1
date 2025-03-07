import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main/Main";
import Chats from "./pages/Chats/Chats";
import { CreateProject } from "./pages/CreateProject/CreateProject";
import { ProjectById } from "./components/ProjectById/ProjectById";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { lazy, Suspense } from "react";
import { MyProjectById } from "./components/MyProjectById/MyProjectById";
import Favourites from "./pages/Favourites/Favourites";

function App() {
  const Project = lazy(() => import("./pages/ProjectPage/ProjectPage"));
  const Investor = lazy(() => import("./pages/InvestorPage/InvestorPage"));
  const Mentor = lazy(() => import("./pages/MentorPage/MentorPage"));
  const MyProject = lazy(() => import("./pages/MyProjects/MyProjects"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/projects"
          element={
            <Suspense fallback={<>Загрузка...</>}>
              <Project />
            </Suspense>
          }
        />
        <Route
          path="/mentor"
          element={
            <Suspense fallback={<>Загрузка...</>}>
              <Mentor />
            </Suspense>
          }
        />
        <Route
          path="/investor"
          element={
            <Suspense fallback={<>Загрузка...</>}>
              <Investor />
            </Suspense>
          }
        />
        <Route path="/chats" element={<Chats />} />
        <Route path="/add" element={<CreateProject />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/project/:project_id" element={<ProjectById />} />
        <Route path="/my-project/:project_id" element={<MyProjectById />} />
        <Route path="/user/:user_id" element={<UserInfo />} />
        <Route
          path="/my-projects/:user_id"
          element={
            <Suspense fallback={<>Загрузка...</>}>
              <MyProject />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

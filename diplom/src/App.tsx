import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Main from './pages/Main/Main'
import ProjectPage from './pages/ProjectPage/ProjectPage'




function App() {
  
  return (

      <Router>
        <Routes>
        <Route
          path="/"
          element={
            <Main />
          }
        />
        <Route
          path="/user"
          element={
             <ProjectPage />
          }
        />
      </Routes>
      </Router>
      
  )
}

export default App

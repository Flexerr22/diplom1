import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Main from './pages/Main/Main'
import UserPage from './pages/UserPage/UserPage'




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
             <UserPage />
          }
        />
      </Routes>
      </Router>
      
  )
}

export default App

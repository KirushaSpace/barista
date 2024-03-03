import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import useToken from "./components/useToken";
import CoursesPage from './pages/Courses';

const App = () => {
  const { token, setToken } = useToken();


  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage setToken={setToken}/>} />
          <Route path="*" element={<LoginPage setToken={setToken}/>} />
          {/* Другие маршруты */}
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
        <Routes>
          <Route path="/courses" element={<CoursesPage />}/>
        </Routes>
      </Router>
  )
};

export default App;
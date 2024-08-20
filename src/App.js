import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import DetailedView from './components/DetailedView';
import PracticePage from './components/PracticePage';
import SolvedProblems from './components/SolvedProblems';
import './App.css'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<SignInPage/>} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/solvedproblems" element={<SolvedProblems/>} />
          <Route path="/profile/:platform/:username" element={<DetailedView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
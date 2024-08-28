import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signuppage from './components/signuppage/Signuppage.jsx';
import Loginpage from './components/loginpage/Loginpage.jsx';
import Chatpage from './components/chatpage/chatpage.jsx';

function App() {

  return (
    <>
    <div className='main-container'>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<Signuppage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/chat" element={<Chatpage />} />
        </Routes>
    </BrowserRouter>
    </div>
    </>
  )
}

export default App

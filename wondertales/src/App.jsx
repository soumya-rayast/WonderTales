import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Home/Home'
function App() {
  const isAuthenticated = !!localStorage.getItem("token")
  return (
    <Router >
      <Routes >
        <Route path='/' element={isAuthenticated ? <Navigate to={'/dashboard'} /> : <Navigate to={'/login'} />} />
        <Route path='/dashboard' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </Router>
  )
}
export default App

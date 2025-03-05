import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Home/Home'
function App() {

  return (
    <div>
      <Router >
        <Routes >
          <Route path='/' element={<Root />} />
          <Route path='/dashboard' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Signup' element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  )
}

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to={"/login"} />
  )
}
export default App

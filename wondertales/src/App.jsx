import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Home/Home'
function App() {

  return (
    <div>
      <Router >
        <Routes >
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/Signup' element={<SignUp/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

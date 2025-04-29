import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import OtpVerify from './pages/OtpVerify'
import ManageStudent from './pages/ManageStudent'
const App = () => {
  return (
    <Routes>
      <Route path='/home' element={<HomePage />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/verify-otp' element={<OtpVerify />} />
      <Route path='/manage-student' element={<ManageStudent />} />
    </Routes >
  )
}

export default App
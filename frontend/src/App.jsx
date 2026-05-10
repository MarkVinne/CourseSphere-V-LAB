import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CourseDetail from './pages/CourseDetail'
import CourseForm from './pages/CourseForm'
import Landing from './pages/Landing'

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<Landing />} />
      <Route path="/login"   element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/courses/new"      element={<ProtectedRoute><CourseForm /></ProtectedRoute>} />
      <Route path="/courses/:id/edit" element={<ProtectedRoute><CourseForm /></ProtectedRoute>} />
      <Route path="/courses/:id"      element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
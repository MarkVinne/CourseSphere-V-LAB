import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3001/api/v1' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const url = err.config?.url || ''
    const isAuthRoute = url.includes('/login') || url.includes('/register')

    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
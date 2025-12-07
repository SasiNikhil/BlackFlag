import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

// Ready check
export const checkReady = async () => {
  const response = await api.get('/health/ready')
  return response.data
}

// Auth API calls
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/v1/auth/login', { email, password })
  return response.data
}

export const logout = async () => {
  const response = await api.post('/api/v1/auth/logout')
  return response.data
}

// Employee API calls
export const getEmployees = async (skip = 0, limit = 1000) => {
  const response = await api.get(`/api/v1/employees?skip=${skip}&limit=${limit}`)
  return response.data
}

export const getEmployee = async (id: number) => {
  const response = await api.get(`/api/v1/employees/${id}`)
  return response.data
}

export const createEmployee = async (data: any) => {
  const response = await api.post('/api/v1/employees', data)
  return response.data
}

export default api




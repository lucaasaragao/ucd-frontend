import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'ucd.token'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
    const message = error.response?.data?.message ?? 'Erro inesperado. Tente novamente.'
    return Promise.reject(new Error(message))
  },
)

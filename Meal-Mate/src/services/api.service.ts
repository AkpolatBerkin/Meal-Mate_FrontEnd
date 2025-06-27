// src/services/api.service.ts
import axios from 'axios'

const API_URL = import.meta.env.PROD
  ? 'https://meal-mate-backend.onrender.com/api'
  : 'http://localhost:8080/api'

export const apiService = {
  getAllRezepte: () => axios.get(`${API_URL}/rezept`),
  getRezeptById: (id: number) => axios.get(`${API_URL}/rezept/${id}`),
  createRezept: (rezept: any) => axios.post(`${API_URL}/rezept`, rezept),
  updateRezept: (id: number, rezept: any) => axios.put(`${API_URL}/rezept/${id}`, rezept),
  deleteRezept: (id: number) => axios.delete(`${API_URL}/rezept/${id}`),
}

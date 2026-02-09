import axios from "axios"
export const API_URL = "http://127.0.0.1:5001";

export class ApiService {
    async checkApi(): Promise<boolean> {
        const response = await axios.get(`${API_URL}/api/v1/health`)
        return response.status === 200
    }

    async getModes(): Promise<any> {
        const response = await axios.get(`${API_URL}/api/v1/modes`)
        return response.data
    }

    async getNotes(): Promise<any> {
        const response = await axios.get(`${API_URL}/api/v1/notes`)
        return response.data
    }

    async getScales(note: string, mode: string): Promise<any> {
        const response = await axios.get(`${API_URL}/api/v1/scales/${encodeURIComponent(note)}/${encodeURIComponent(mode)}`)
        return response.data
    }
}
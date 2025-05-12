import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const authService = {
  async login(username: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  async getUserInfo() {
    const token = this.getToken();
    if (!token) throw new Error('No token');
    const response = await axios.get(`${API_URL}/user/test`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // If the endpoint returns an array, return the first user (current user)
    if (Array.isArray(response.data)) {
      return response.data[0];
    }
    return response.data;
  },

  async register(data: { username: string; email: string; password: string; name?: string; surname?: string }) {
    // Only username, email, and password are required by backend, but we send all fields
    return await axios.post(`${API_URL}/auth/register`, {
      username: data.username,
      email: data.email,
      password: data.password,
      name: data.name,
      surname: data.surname,
    });
  },
}; 
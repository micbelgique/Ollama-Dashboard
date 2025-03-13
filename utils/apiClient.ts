import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.OLLAMA_API_URL || "http://localhost:11434/",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

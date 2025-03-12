import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:11434/",
});

export default apiClient;

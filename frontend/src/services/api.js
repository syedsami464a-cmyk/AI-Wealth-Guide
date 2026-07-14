import axios from "axios";

const api = axios.create({
    baseURL: "https://ai-wealth-guide-backend.onrender.com",
});

export default api;
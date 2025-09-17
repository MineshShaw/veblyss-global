import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

const api = axios.create({baseURL: API_URL, withCredentials: true,})

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/user/current");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (name: string, email: string) => {
  try {
    const response = await api.put("/api/user/update", { name, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserCart = async (cartdata: object) => {
  try {
    const response = await api.put("/api/user/update-cart", { cartdata });
    return response.data;
  } catch (error) {
    throw error;
  }
};
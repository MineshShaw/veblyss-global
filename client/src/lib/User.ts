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

export const updateUserProfile = async (name: string, email: string, addressdata: Array<object>) => {
  try {
    const response = await api.patch("/api/user/update-profile", { name, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserOrder = async (orderdata: object) => {
  try {
    const response = await api.patch("/api/user/update-order", { orderdata });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserAddress = async (addressdata: object) => {
  try {
    const response = await api.patch("/api/user/update-address", { addressdata });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserWishlist = async (wishlistdata: object) => {
  try {
    const response = await api.patch("/api/user/update-wishlist", { wishlistdata });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserCart = async (cartdata: object) => {
  try {
    const response = await api.patch("/api/user/update-cart", { cartdata });
    return response.data;
  } catch (error) {
    throw error;
  }
};
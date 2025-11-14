import { jwtDecode } from 'jwt-decode';


const TOKEN_KEY = 'sweet_shop_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token || !isTokenValid()) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getUserFromToken();
  return user?.roles?.includes('ADMIN') || false;
};

export const isAuthenticated = () => {
  return isTokenValid();
};
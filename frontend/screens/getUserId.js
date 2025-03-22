import * as SecureStore from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';

export const getUserId = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};


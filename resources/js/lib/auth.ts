import axios from 'axios';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}

export const authApi = {
    async login(credentials: LoginCredentials) {
        const response = await axios.post('/api/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    async logout() {
        const token = getToken();
        if (token) {
            try {
                await axios.post(
                    '/api/auth/logout',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
    },

    async me() {
        const token = getToken();
        if (!token) return null;

        try {
            const response = await axios.get('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            return null;
        }
    },
};

export const getToken = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getUser = (): User | null => {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.is_admin || false;
};

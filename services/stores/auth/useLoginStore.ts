import { secureFetch } from '@/services/http/secureFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// entities
import { User } from '@/entities/User';

interface LoginStore {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    login: (email: string, password: string) => Promise<boolean>;
    error: string | null;
    setError: (error: string | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    user: User;
    setUser: (user: User) => void;
    getUserDetails: () => Promise<User>;
}

export const useLoginStore = create<LoginStore>((set, get) => ({
    loading: false,
    setLoading: (loading) => set({ loading }),
    error: null,
    setError: (error) => set({ error }),
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    user: {} as User,
    setUser: (user) => set({ user }),

    /**
     * Login function
     * @param email 
     * @param password 
     * @returns 
     */
    async login(email: string, password: string): Promise<boolean> {
        const { setLoading, setIsAuthenticated, setError } = get()
        setError(null) 
        const { data, error } = await secureFetch(`/auth/login`, {
            method: 'POST',
            stringify: true,
            content_type: 'application/json',
            body: { email: email.trim(), password: password.trim() }
        }, setLoading)

        if (error) {
            setIsAuthenticated(false)
            setError(error)
            console.log(error)

            return false
        }

        if (data) {
            setIsAuthenticated(true)
            await AsyncStorage.setItem('token', data.tokens.access_token)
            await AsyncStorage.setItem('refresh_token', data.tokens.refresh_token)

            return true
        }

        return false
    },

    /**
     * Get user details
     * @returns User
    */
    async getUserDetails(): Promise<User> {
        const { setLoading, setIsAuthenticated, setError, setUser } = get()
        setError(null) 
        const { data, error } = await secureFetch(`/auth/verify`, {
            method: 'GET',
            content_type: 'application/json'
        }, setLoading)

        if (error) {
            setIsAuthenticated(false)
            setError(error)
            console.log(error)

            return {} as User
        }

        if (data) {
            setIsAuthenticated(true)
            setError(null)
            setUser(data)

            return data
        }

        return {} as User
    }
}))
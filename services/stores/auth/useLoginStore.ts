import { secureFetch } from '@/services/http/secureFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface LoginStore {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    login: (email: string, password: string) => Promise<boolean>;
    error: string | null;
    setError: (error: string | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useLoginStore = create<LoginStore>((set, get) => ({
    loading: false,
    setLoading: (loading) => set({ loading }),
    error: null,
    setError: (error) => set({ error }),
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    async login(email: string, password: string): Promise<boolean> {
        const { setLoading, setIsAuthenticated, setError } = get()
        setError(null) 
        const { data, error } = await secureFetch(`/auth/login`, {
            method: 'POST',
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
            console.log(data)
            await AsyncStorage.setItem('token', data.tokens.access_token)
            await AsyncStorage.setItem('refresh_token', data.tokens.refresh_token)

            return true
        }

        return false
    }
}))
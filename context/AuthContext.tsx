import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, login as shopifyLogin, register as shopifyRegister, logout as shopifyLogout, getCustomer } from '../lib/customer';
import { Toast } from '../components/Toast';

interface AuthContextType {
    user: Customer | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, first: string, last: string) => Promise<void>;
    logout: () => void;
    showToast: (msg: string, type: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('shopify_customer_token');
            if (token) {
                try {
                    const customer = await getCustomer(token);
                    setUser(customer);
                } catch (e) {
                    console.error('Session expired', e);
                    localStorage.removeItem('shopify_customer_token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type });
    };

    const login = async (email: string, password: string) => {
        try {
            const { accessToken } = await shopifyLogin(email, password);
            localStorage.setItem('shopify_customer_token', accessToken);
            const customer = await getCustomer(accessToken);
            setUser(customer);
            showToast(`Welcome back, ${customer.firstName}`, 'success');

            // Link Cart to User
            try {
                const { associateCartWithUser } = await import('../api');
                await associateCartWithUser(accessToken);
            } catch (e) { console.warn("Cart sync skipped"); }

        } catch (e: any) {
            showToast(e.message || 'Login failed', 'error');
            throw e;
        }
    };

    const register = async (email: string, password: string, first: string, last: string) => {
        try {
            await shopifyRegister(email, password, first, last);
            showToast('Account created! Please login.', 'success');
        } catch (e: any) {
            showToast(e.message || 'Registration failed', 'error');
            throw e;
        }
    };

    const logout = async () => {
        const token = localStorage.getItem('shopify_customer_token');
        if (token) {
            try { await shopifyLogout(token); } catch (e) { }
        }
        localStorage.removeItem('shopify_customer_token');
        setUser(null);
        showToast('Logged out successfully', 'success');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, showToast }}>
            {children}
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

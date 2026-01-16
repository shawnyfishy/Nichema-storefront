import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
    onNavigate: (path: string) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
            onNavigate('/shop');
        } catch (error) {
            // Toast handled in context
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-[var(--bg-main)]">
            <div className="w-full max-w-md glass-card p-10 rounded-[3rem] border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                <h2 className="text-4xl serif text-center mb-8 text-[var(--text-main)]">Welcome Back</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold ml-4 opacity-60">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/40 border border-white/30 rounded-full px-6 py-4 text-sm focus:outline-none focus:bg-white/60 transition-all font-medium"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold ml-4 opacity-60">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/40 border border-white/30 rounded-full px-6 py-4 text-sm focus:outline-none focus:bg-white/60 transition-all font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[var(--primary-peony)] text-white py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-extrabold shadow-lg hover:bg-[var(--primary-espresso)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    >
                        {isSubmitting ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => onNavigate('/register')}
                        className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[var(--primary-peony)] transition-colors border-b border-transparent hover:border current"
                    >
                        New to Nichema? Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;

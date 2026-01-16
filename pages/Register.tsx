import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
    onNavigate: (path: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(formData.email, formData.password, formData.firstName, formData.lastName);
            onNavigate('/login');
        } catch (error) {
            // Toast in context
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-[var(--bg-main)]">
            <div className="w-full max-w-md glass-card p-10 rounded-[3rem] border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                <h2 className="text-4xl serif text-center mb-8 text-[var(--text-main)]">Join the Circle</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold ml-4 opacity-60">First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-white/40 border border-white/30 rounded-full px-6 py-4 text-sm focus:outline-none focus:bg-white/60"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold ml-4 opacity-60">Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-white/40 border border-white/30 rounded-full px-6 py-4 text-sm focus:outline-none focus:bg-white/60"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold ml-4 opacity-60">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white/40 border border-white/30 rounded-full px-6 py-4 text-sm focus:outline-none focus:bg-white/60"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold ml-4 opacity-60">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-white/40 border border-white/30 rounded-full px-6 py-4 text-sm focus:outline-none focus:bg-white/60"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[var(--primary-peony)] text-white py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-extrabold shadow-lg hover:bg-[var(--primary-espresso)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 mt-4"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => onNavigate('/login')}
                        className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[var(--primary-peony)] transition-colors border-b border-transparent hover:border current"
                    >
                        Already have an account? Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;

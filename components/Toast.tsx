import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl border z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 ${type === 'success'
                ? 'bg-green-100/80 border-green-200 text-green-900'
                : 'bg-red-100/80 border-red-200 text-red-900'
            }`}>
            <div className="flex items-center space-x-3 text-xs uppercase tracking-widest font-bold">
                <span>{type === 'success' ? '✓' : '!'}</span>
                <span>{message}</span>
            </div>
        </div>
    );
};

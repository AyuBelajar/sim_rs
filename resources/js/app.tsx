import React from 'react';

import {
    createRoot,
} from 'react-dom/client';

import {
    AuthProvider,
} from './features/auth/AuthContext';

import {
    AppRouter,
} from './router';

const element =
    document.getElementById('app');

if (!element) {
    throw new Error(
        'Root element #app tidak ditemukan.',
    );
}

createRoot(element).render(
    <React.StrictMode>
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>,
);
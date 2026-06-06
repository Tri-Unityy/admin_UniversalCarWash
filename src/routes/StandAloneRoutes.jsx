// StandaloneRoutes.js
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Import your components
const GeneratedBill = lazy(() => import('views/billView'));

// Standalone routes
const StandaloneRoutes = {
    path: '/',
    element: <GeneratedBill />, // Assuming this is the root element for your new route
    children: [
        {
            path: 'generatedBill',
            element: <GeneratedBill />
        }
    ]
};

export default StandaloneRoutes;

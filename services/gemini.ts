// gemini.ts

import axios from 'axios';

const GEMINI_API_URL = 'https://api.gemini.com/v1';

// Error classification
const ERROR_CODES = {
    400: 'Bad Request',
    401: 'Unauthorized',
    404: 'Not Found',
    500: 'Internal Server Error'
};

// Function to make a Gemini API call
const callGeminiAPI = async (endpoint: string, params: object = {}) => {
    try {
        const response = await axios.get(`${GEMINI_API_URL}${endpoint}`, { params });
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};

// Error handling function
const handleErrors = (error: any) => {
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = ERROR_CODES[statusCode] || 'An unexpected error occurred';
    console.error(`Error ${statusCode}: ${errorMessage}`);
    return { status: 'error', message: errorMessage };
};

// A context-aware fallback function (example usage)
const getMarketData = async (symbol: string) => {
    const data = await callGeminiAPI(`/markets/${symbol}/book`);
    if (!data || data.error) {
        console.warn('Fallback: Using cached data or default response.');
        // Implement fallback logic here
    }
    return data;
};

export { callGeminiAPI, getMarketData };
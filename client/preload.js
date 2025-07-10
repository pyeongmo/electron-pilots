const { contextBridge } = require('electron');
const axios = require('axios');

const SERVER_BASE_URL = 'http://localhost:3000/api';

contextBridge.exposeInMainWorld('api', {
    getSomethings: async () => {
        try {
            const response = await axios.get(`${SERVER_BASE_URL}/somethings`);
            return response.data.somethings;
        } catch (error) {
            console.error('Error fetching somethings:', error);
            throw error;
        }
    },
    addSomething: async (name, value) => {
        try {
            const response = await axios.post(`${SERVER_BASE_URL}/somethings`, { name, value });
            return response.data;
        } catch (error) {
            console.error('Error adding something:', error);
            throw error;
        }
    }
});

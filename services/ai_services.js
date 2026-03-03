const axios = require('axios');

const AI_BASE = process.env.AI_BASE

if (!AI_BASE) {
  throw new Error("AI_BASE is not defined in environment variables");
}

exports.getRecommendations = async (userId) => {
    try {
        const response = await axios.get(`${AI_BASE}/recommend/${userId}`);
        return response.data.products || [];
    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        return [];
    }}
exports.checkFraud = async (payload) => {
    try {
        const response = await axios.post(`${AI_BASE}/fraud`, payload);
        return response.data.fraud;
    } catch (error) {
        console.error('Error fetching fraud score:', error.message);
        return null;
    }}
exports.getPrice= async (payload) => {
    try {
        const response = await axios.post(`${AI_BASE}/price`, payload);
        return response.data.price;
    } catch (error) {
        console.error('Error fetching price:', error.message);
        return null;
    }}
exports.predictAbandon= async (payload) => {
    try {
        const response = await axios.post(`${AI_BASE}/abandon`, payload);
        return response.data.abandon_probability;
    } catch (error) {
        console.error('Error predicting abandonment:', error.message);
        return null;
    }}

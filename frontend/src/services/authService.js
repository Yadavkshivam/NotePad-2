import api from './api.js';


export async function requestOtp(email) {
const { data } = await api.post('/auth/request-otp', { email });
console.log("hii");
return data;
}


export async function verifyOtp(email, otp, name) {
const { data } = await api.post('/auth/verify-otp', { email, otp, name });
return data; 
}
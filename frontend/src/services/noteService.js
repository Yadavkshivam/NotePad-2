import api from './api.js';


export async function getNotes(token) {
const { data } = await api.get('/notes', { headers: { Authorization: `Bearer ${token}` } });
return data;
}


export async function createNote(token, payload) {
const { data } = await api.post('/notes', payload, { headers: { Authorization: `Bearer ${token}` } });
return data;
}


export async function deleteNote(token, id) {
const { data } = await api.delete(`/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
return data;
}


export async function updateNote(token, id, payload) {
const { data } = await api.put(`/notes/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
return data;
}
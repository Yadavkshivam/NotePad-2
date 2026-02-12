import Note from '../models/Note.js';


export async function getNotes(req, res) {
const userId = req.user.sub;
const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
res.json(notes);
}


export async function createNote(req, res) {
const userId = req.user.sub;
const { title, content } = req.body;
if (!title) return res.status(400).json({ message: 'Title is required' });
const note = await Note.create({ user: userId, title, content: content || '' });
res.status(201).json(note);
}


export async function deleteNote(req, res) {
const userId = req.user.sub;
const { id } = req.params;
const note = await Note.findOne({ _id: id, user: userId });
if (!note) return res.status(404).json({ message: 'Note not found' });
await note.deleteOne();
res.json({ message: 'Deleted' });
}


export async function updateNote(req, res) {
const userId = req.user.sub;
const { id } = req.params;
const { title, content } = req.body;
const note = await Note.findOne({ _id: id, user: userId });
if (!note) return res.status(404).json({ message: 'Note not found' });
if (title !== undefined) note.title = title;
if (content !== undefined) note.content = content;
await note.save();
res.json(note);
}
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getNotes, createNote, deleteNote, updateNote } from '../services/noteService.js';
import NoteCard from '../components/NoteCard.jsx';
import { generateAINotes } from '../services/aiService.js';


export default function Dashboard() {
  const { token, user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);


  async function load() {
    try {
      const data = await getNotes(token);
      setNotes(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load notes');
    }
  }

  useEffect(() => { load(); }, []);

  async function addNote(e) {
    e.preventDefault();
    setError('');
    try {
      const n = await createNote(token, { title, content });
      setNotes(prev => [n, ...prev]);
      setTitle('');
      setContent('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create note');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNote(token, id);
      setNotes(prev => prev.filter(n => n._id !== id));
      closeModal();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete note');
    }
  }

  // Open note modal to view full content
  function openNoteModal(note) {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content || '');
    setAiSummary('');
    setIsEditing(false);
  }


  function closeModal() {
    setSelectedNote(null);
    setIsEditing(false);
    setAiSummary('');
  }


  function startEditing() {
    setIsEditing(true);
  }

  // Save edited note
  async function saveEdit() {
    try {
      const updated = await updateNote(token, selectedNote._id, { title: editTitle, content: editContent });
      setNotes(prev => prev.map(n => n._id === selectedNote._id ? updated : n));
      setSelectedNote(updated);
      setIsEditing(false);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update note');
    }
  }

  // Generate AI summary for the note
  async function generateSummary() {
    if (!selectedNote?.content) {
      setError('No content to summarize');
      return;
    }
    setSummaryLoading(true);
    try {
      const summary = await generateAINotes(selectedNote.content);
      setAiSummary(summary);
    } catch (e) {
      setError(e?.message || 'Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  }

  async function handleAskAI() {
    if (!content.trim()) {
      setError('Please enter some content first to generate suggestions');
      return;
    }
    setError('');
    setAiLoading(true);
    try {
      const generatedNotes = await generateAINotes(content);
      setContent(generatedNotes);
    } catch (e) {
      setError(e?.message || 'Failed to generate AI suggestions');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-indigo-50 px-4 sm:px-8 py-8">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-[slideUp_0.5s_ease-out]">
          Welcome{user?.name ? `, ${user.name}` : ''} 👋
        </h2>
        

        {error && (
          <div className="bg-linear-to-r from-red-100 to-red-200 border border-red-400 rounded-xl p-4 mb-6 text-red-600 text-sm animate-[shake_0.5s_ease-in-out]">
            {error}
          </div>
        )}


        <form onSubmit={addNote} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            ✍️ Create New Note
          </h3>
          <div className="space-y-4">
            <input 
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-gray-300" 
              placeholder="Note title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
            <div className="relative">
              <textarea 
                className="w-full px-4 py-3 pb-12 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-gray-300 resize-none" 
                placeholder="Details (optional)" 
                rows="3" 
                value={content} 
                onChange={e => setContent(e.target.value)} 
              />
              <button 
                type="button"
                onClick={handleAskAI}
                disabled={aiLoading || !content.trim()}
                className={`absolute right-3 bottom-3 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-1.5 ${
                  aiLoading || !content.trim()
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 hover:border-purple-300 hover:shadow-md active:scale-95'
                }`}
              >
                {aiLoading ? (
                  <>
                    <span className="animate-spin">⚡</span> Generating...
                  </>
                ) : (
                  <>
                    🤖 Ask AI
                  </>
                )}
              </button>
            </div>
            <button className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-linear-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40 active:translate-y-0">
              ➕ Add Note
            </button>
          </div>
        </form>


        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            📚 Your Notes 
            <span className="text-sm font-normal text-gray-400">({notes.length})</span>
          </h3>
        </div>
        
        {notes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500">No notes yet. Create your first note above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(n => (
              <NoteCard 
                key={n._id} 
                note={n} 
                onDelete={handleDelete} 
                onEdit={() => { openNoteModal(n); startEditing(); }}
                onClick={() => openNoteModal(n)}
              />
            ))}
          </div>
        )}
      </div>


      {selectedNote && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              {isEditing ? (
                <input
                  className="text-xl font-bold text-gray-800 flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  📝 {selectedNote.title}
                </h2>
              )}
              <button 
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>


            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 resize-none"
                  rows="6"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="Note content..."
                />
              ) : (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedNote.content || 'No content'}
                  </p>
                </div>
              )}


              {!isEditing && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    
                    <button
                      onClick={generateSummary}
                      disabled={summaryLoading || !selectedNote.content}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-1.5 ${
                        summaryLoading || !selectedNote.content
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 hover:border-purple-300 active:scale-95'
                      }`}
                    >
                      {summaryLoading ? (
                        <>
                          <span className="animate-spin">⚡</span> Generating...
                        </>
                      ) : (
                        <>
                          ✨ Generate Summary
                        </>
                      )}
                    </button>
                  </div>
                  {aiSummary && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap animate-[fadeIn_0.3s_ease-out]">
                      {aiSummary}
                    </div>
                  )}
                </div>
              )}
            </div>


            <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
              <div className="text-xs text-gray-400">
                Created: {new Date(selectedNote.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      💾 Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleDelete(selectedNote._id)}
                      className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                    >
                      🗑️ Delete
                    </button>
                    <button
                      onClick={startEditing}
                      className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      ✏️ Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

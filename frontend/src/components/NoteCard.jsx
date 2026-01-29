import React from 'react';


export default function NoteCard({ note, onDelete, onEdit, onClick }) {
return (
<div 
  className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-purple-200 group cursor-pointer"
  onClick={onClick}
>
  <div className="flex justify-between items-start gap-3">
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-gray-800 text-lg truncate group-hover:text-purple-600 transition-colors duration-300">
        📝 {note.title}
      </h3>
    </div>
    <div className="flex gap-2 shrink-0">
      <button 
        className="px-3 py-1.5 text-sm font-medium text-purple-500 bg-purple-50 rounded-lg transition-all duration-300 hover:bg-purple-500 hover:text-white hover:shadow-md hover:shadow-purple-500/30 active:scale-95"
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
      >
        ✏️ Edit
      </button>
      <button 
        className="px-3 py-1.5 text-sm font-medium text-red-500 bg-red-50 rounded-lg transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/30 active:scale-95"
        onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
      >
        🗑️ Delete
      </button>
    </div>
  </div>
  {note.content && (
    <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3">
      {note.content}
    </p>
  )}
  <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
    <span>Click to view full note</span>
    <span>•</span>
    <span>🤖 AI Summary available</span>
  </div>
</div>
);
}   
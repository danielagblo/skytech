"use client"
import React, { useState, useEffect } from 'react';
import { updateHomeHero } from '../actions';

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    imageUrl: ''
  });

  // In a real app, you'd fetch initial data here. 
  // For now, we'll assume the user fills it in or we could add a fetch action.

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.target);
    const result = await updateHomeHero(formData);

    if (result.success) {
      setMessage('Hero section updated successfully!');
      if (result.imageUrl) {
        setHero(prev => ({ ...prev, imageUrl: result.imageUrl }));
      }
    } else {
      setMessage('Error: ' + result.error);
    }
    setLoading(false);
  }

  const triggerUpload = () => {
    document.getElementById('hero-upload').click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center space-y-8">
        {message && (
          <div className={`p-4 rounded-2xl font-bold text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative group">
          <input 
            type="file" 
            id="hero-upload"
            name="image" 
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleSubmit({ preventDefault: () => {}, target: e.target.form });
            }}
          />
          <input type="hidden" name="currentImageUrl" value={hero.imageUrl} />
          
          <div 
            onClick={triggerUpload}
            className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl cursor-pointer group-hover:scale-[1.02] transition-all duration-500 bg-slate-200"
          >
            {hero.imageUrl ? (
              <img src={hero.imageUrl} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-black uppercase tracking-widest">
                No Image Set
              </div>
            )}
            
            <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-black uppercase tracking-tighter text-xl">
                {loading ? 'Processing...' : 'Change Image'}
              </span>
            </div>
          </div>
        </form>
        
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Click the image to upload a new version
        </p>
      </div>
    </div>
  );
}

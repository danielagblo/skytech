'use client';

import { useState } from 'react';
import { ITeamMember } from '../../lib/team';
import { updateTeamAction, uploadPartnerLogoAction } from '../../admin/actions';

export default function TeamManager({ initialMembers }: { initialMembers: ITeamMember[] }) {
  const [members, setMembers] = useState<ITeamMember[]>(initialMembers);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    imageUrl: ''
  });

  async function handleSave(newMembers: ITeamMember[]) {
    setLoading(true);
    setMessage('');
    const result = await updateTeamAction(newMembers);
    if (result.success) {
      setMessage('Team updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error: ' + result.error);
    }
    setLoading(false);
  }

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.role.trim()) {
      setMessage('Error: Name and Role are required.');
      return;
    }
    const newMembers = [...members, { ...formData, _id: Date.now().toString() }];
    setMembers(newMembers);
    handleSave(newMembers);
    setFormData({ name: '', role: '', bio: '', imageUrl: '' });
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    if (!formData.name.trim() || !formData.role.trim()) {
      setMessage('Error: Name and Role are required.');
      return;
    }
    const newMembers = members.map(m => m._id === editingId ? { ...m, ...formData } : m);
    setMembers(newMembers);
    handleSave(newMembers);
    setEditingId(null);
    setFormData({ name: '', role: '', bio: '', imageUrl: '' });
    setIsAdding(false);
  };


  const handleDelete = (id: string | undefined) => {
    if (!id || !confirm('Delete this team member?')) return;
    const newMembers = members.filter(m => m._id !== id);
    setMembers(newMembers);
    handleSave(newMembers);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    
    setLoading(true);
    const result = await uploadPartnerLogoAction(uploadData); // Re-using logo upload action for simplicity
    if (result.success && result.imageUrl) {
      setFormData({ ...formData, imageUrl: result.imageUrl });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Leadership Team</h1>
          <p className="text-slate-500">Manage your core engineering and executive team.</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              setEditingId(null);
              setFormData({ name: '', role: '', bio: '', imageUrl: '' });
            }
            setIsAdding(!isAdding);
          }}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          {isAdding ? 'Cancel' : '+ Add Member'}
        </button>

      </div>

      {message && (
        <div className={`p-4 rounded-2xl font-bold text-center ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      {isAdding && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-xl font-bold">{editingId ? 'Edit Member' : 'New Member'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Edmund K. Mensah"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position / Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="CEO & Lead Architect"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biography</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                placeholder="15+ years experience..."
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Photo</label>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold uppercase text-[10px]">No Photo</div>
                  )}
                </div>
                <input type="file" onChange={handleFileUpload} className="text-sm text-slate-500" />
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={loading}
              className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : editingId ? 'Update Member' : 'Save Member'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 overflow-hidden border-2 border-blue-100">
                {member.imageUrl ? (
                  <img src={member.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-600 font-black text-xl">{member.name.charAt(0)}</div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(member._id!);
                    setFormData({ name: member.name, role: member.role, bio: member.bio, imageUrl: member.imageUrl || '' });
                    setIsAdding(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1">{member.role}</p>
            <p className="text-slate-500 text-sm mt-4 leading-relaxed line-clamp-3">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

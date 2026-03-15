'use client';

import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  note?: string;
  avatar: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'> & { id?: string }>({
    name: '',
    role: '',
    focus: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/content/team');
      const data = await res.json();
      setTeam(data);
    } catch (error) {
      console.error('Failed to fetch team:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTeam = async (newTeam: TeamMember[]) => {
    try {
      await fetch('/api/content/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam),
      });
    } catch (error) {
      console.error('Failed to save team:', error);
    }
  };

  const handleAdd = () => {
    if (formData.name && formData.role) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        ...(formData as Omit<TeamMember, 'id'>),
      };
      const newTeam = [...team, newMember];
      setTeam(newTeam);
      saveTeam(newTeam);
      setFormData({ name: '', role: '', focus: '', avatar: '' });
      setIsAdding(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleSave = () => {
    if (editingId) {
      const newTeam = team.map(m => (m.id === editingId ? { ...m, ...(formData as TeamMember) } : m));
      setTeam(newTeam);
      saveTeam(newTeam);
      setEditingId(null);
      setFormData({ name: '', role: '', focus: '', avatar: '' });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    const newTeam = team.filter(m => m.id !== id);
    setTeam(newTeam);
    saveTeam(newTeam);
  };

  const roles = ['All', ...Array.from(new Set(team.map(m => m.role).filter(Boolean)))];

  const filteredTeam = team.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.focus.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'All' || member.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-600 mt-2">Add, edit, or remove team members</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-colors"
        >
          {isAdding ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {/* Filters Overlay */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search name, role, focus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-64">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Role</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        { (searchTerm || filterRole !== 'All') && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterRole('All');
            }}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">{editingId ? 'Edit Member' : 'New Team Member'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="E.g., Engineering Lead"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Focus Area</label>
              <textarea
                value={formData.focus}
                onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="What do they focus on?"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={editingId ? handleSave : handleAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                {editingId ? 'Save Changes' : 'Add Member'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ name: '', role: '', focus: '', avatar: '' });
                }}
                className="flex-1 px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredTeam.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No team members found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <div key={member.id} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-slate-900">{member.name}</h3>
              <p className="text-sm text-blue-600 font-semibold mt-1">{member.role}</p>
              <p className="text-sm text-slate-600 mt-3">{member.focus}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

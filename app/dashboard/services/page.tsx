'use client';

import { useState, useEffect } from 'react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/content/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveServices = async (newServices: Service[]) => {
    try {
      await fetch('/api/content/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newServices),
      });
    } catch (error) {
      console.error('Failed to save services:', error);
    }
  };

  const handleAdd = () => {
    if (formData.title && formData.description) {
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
      };
      const newServices = [...services, newService];
      setServices(newServices);
      saveServices(newServices);
      setFormData({ title: '', description: '', icon: '' });
      setIsAdding(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
  };

  const handleSave = () => {
    if (editingId) {
      const newServices = services.map(s => (s.id === editingId ? { ...s, ...formData } : s));
      setServices(newServices);
      saveServices(newServices);
      setEditingId(null);
      setFormData({ title: '', description: '', icon: '' });
    }
  };

  const handleDelete = (id: string) => {
    const newServices = services.filter(s => s.id !== id);
    setServices(newServices);
    saveServices(newServices);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Services Management</h1>
          <p className="text-slate-600 mt-2">Manage your service offerings</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          {isAdding ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">{editingId ? 'Edit Service' : 'New Service'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Service Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="E.g., Custom Web Applications"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Describe this service"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Icon Emoji</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="E.g., 🌐"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={editingId ? handleSave : handleAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                {editingId ? 'Save Changes' : 'Add Service'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ title: '', description: '', icon: '' });
                }}
                className="flex-1 px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="text-3xl mb-3">{service.icon}</div>
            <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
            <p className="text-slate-600 text-sm mt-2">{service.description}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(service)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

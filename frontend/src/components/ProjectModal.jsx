import { useState, useEffect, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

const ProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      dueDate: '',
      status: 'active'
    });
    setError('');
    setLoading(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status
      };
      if (formData.dueDate) {
        payload.dueDate = formData.dueDate;
      }

      const res = await api.post('/projects', payload);
      handleClose();
      if (onSuccess) {
        onSuccess(res.data.data);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
      const serverMsg = err.response?.data?.error;
      const message = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : serverMsg || err.message || 'Failed to create project. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-slate-900">
            Create New Project
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-5 text-sm font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              placeholder="E.g. Mobile App Redesign"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              rows="3"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              placeholder="Describe the project goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Due Date <span className="text-xs font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
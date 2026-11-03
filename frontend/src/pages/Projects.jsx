import { useState, useEffect } from 'react';
import { Briefcase, Plus, MoreVertical, ExternalLink, Trash2 } from 'lucide-react';
import api from '../services/api';
import ProjectModal from '../components/ProjectModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500">Manage and track your ongoing projects.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
        >
          <Plus size={20} /> Create Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                  <Briefcase size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(project._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{project.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6">{project.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  project.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {project.status}
                </span>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline">
                  Details <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
               <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
               <p className="text-slate-500 font-medium">No projects found. Create your first project to get started!</p>
            </div>
          )}
        </div>
      )}

      <ProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchProjects()}
      />
    </div>
  );
};

export default Projects;

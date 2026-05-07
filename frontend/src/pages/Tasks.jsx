import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Filter, Calendar, Tag, User, Trash2 } from 'lucide-react';
import api from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    project: '', 
    priority: 'medium', 
    dueDate: '' 
  });

  const fetchData = async () => {
    try {
      const [taskRes, projRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(taskRes.data.data);
      setProjects(projRes.data.data);
      if (projRes.data.data.length > 0) {
        setNewTask(prev => ({ ...prev, project: projRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', project: projects[0]?._id || '', priority: 'medium', dueDate: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500">Track and manage project tasks.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
        >
          <Plus size={20} /> Add Task
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
         {['todo', 'in-progress', 'done'].map((status) => (
           <div key={status} className="flex-1 min-w-[320px]">
             <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-700 capitalize">{status.replace('-', ' ')}</h2>
                  <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === status).length}
                  </span>
                </div>
             </div>
             <div className="space-y-4">
                {tasks.filter(t => t.status === status).map((task) => (
                  <div key={task._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        task.priority === 'high' ? 'bg-rose-100 text-rose-600' : 
                        task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(task._id)} className="p-1 text-slate-400 hover:text-rose-500 rounded">
                           <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{task.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Tag size={12} /> {task.project?.name || 'General'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Calendar size={12} /> {new Date(task.dueDate || Date.now()).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary-700">
                           {task.assignedTo?.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <select 
                        className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg outline-none cursor-pointer"
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
             </div>
           </div>
         ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title</label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  placeholder="Task name"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Project</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    value={newTask.project}
                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  placeholder="Describe the task..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

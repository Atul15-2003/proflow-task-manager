import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import api from '../services/api';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <TrendingUp size={12} className="mr-1" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks')
        ]);
        
        const tasks = taskRes.data.data;
        const today = new Date();
        setStats({
          projects: projRes.data.count,
          tasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'done').length,
          pendingTasks: tasks.filter(t => t.status !== 'done').length,
          overdueTasks: tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < today).length
        });
        setRecentTasks(tasks.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-slate-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Briefcase} 
          label="Total Projects" 
          value={stats.projects} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={Clock} 
          label="Active Tasks" 
          value={stats.pendingTasks} 
          color="bg-amber-500" 
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Completed" 
          value={stats.completedTasks} 
          color="bg-emerald-500" 
        />
        <StatCard 
          icon={AlertCircle} 
          label="Overdue" 
          value={stats.overdueTasks} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Recent Tasks</h2>
            <button className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentTasks.length > 0 ? recentTasks.map((task) => (
              <div key={task._id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${
                    task.priority === 'high' ? 'bg-rose-500' : 
                    task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{task.project?.name || 'No Project'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Due Date</p>
                    <p className="text-sm text-slate-600">{new Date(task.dueDate || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    task.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500 italic">No tasks found. Create one to get started!</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-6">Task Progress</h2>
          <div className="flex items-center justify-center mb-8">
             <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeDasharray="100, 100"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary-600"
                    strokeDasharray={`${stats.tasks ? (stats.completedTasks/stats.tasks)*100 : 0}, 100`}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">{stats.tasks ? Math.round((stats.completedTasks/stats.tasks)*100) : 0}%</span>
                  <span className="text-xs text-slate-500 font-medium uppercase">Done</span>
                </div>
             </div>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                  <span className="text-sm text-slate-600 font-medium">Completed</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{stats.completedTasks}</span>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-slate-600 font-medium">In Progress</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{stats.tasks - stats.completedTasks}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

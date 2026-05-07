import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Users, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ProFlow</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  ];

  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 overflow-hidden`}>
      <div className={`transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-6'}`}>
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 mb-10 cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div className="bg-primary-500 p-2 rounded-lg flex-shrink-0">
            <Briefcase className="text-white w-6 h-6" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">
              ProFlow
            </span>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                  : 'hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className={`mt-auto transition-all duration-300 border-t border-slate-800 ${isCollapsed ? 'p-4' : 'p-6'}`}>
        <button
          onClick={() => dispatch(logout())}
          className={`flex items-center gap-3 py-3 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

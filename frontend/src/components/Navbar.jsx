import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  CheckSquare, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Clock 
} from 'lucide-react';
import { logout } from '../slices/authSlice';
import api from '../services/api';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeDropdown, setActiveDropdown] = useState(null); // 'notifications' | 'profile' | null
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem('proflow_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch and derive notifications from tasks
  useEffect(() => {
    let isMounted = true;
    const fetchTaskNotifications = async () => {
      try {
        const res = await api.get('/tasks');
        if (!isMounted) return;
        const tasks = res.data.data || [];
        const derived = [];
        const now = new Date();
        const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        tasks.forEach((task) => {
          if (task.status === 'done') return;

          if (task.dueDate) {
            const due = new Date(task.dueDate);
            if (due < now) {
              derived.push({
                id: `overdue-${task._id}`,
                title: `Overdue: ${task.title}`,
                text: `Due on ${due.toLocaleDateString()} (${task.project?.name || 'General'})`,
                time: due,
                type: 'overdue'
              });
            } else if (due <= next24h) {
              derived.push({
                id: `due-soon-${task._id}`,
                title: `Due Soon: ${task.title}`,
                text: `Due by ${due.toLocaleDateString()} (${task.project?.name || 'General'})`,
                time: due,
                type: 'due-soon'
              });
            }
          }

          if (task.createdAt) {
            const created = new Date(task.createdAt);
            if (now.getTime() - created.getTime() <= 48 * 60 * 60 * 1000) {
              derived.push({
                id: `recent-${task._id}`,
                title: `Active Task: ${task.title}`,
                text: `Priority: ${task.priority} • ${task.project?.name || 'General'}`,
                time: created,
                type: 'recent'
              });
            }
          }
        });

        derived.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(derived);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetchTaskNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (e) => {
      if (
        notificationsRef.current && !notificationsRef.current.contains(e.target) &&
        profileRef.current && !profileRef.current.contains(e.target)
      ) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDropdown]);

  const formatRelativeTime = (dateInput) => {
    if (!dateInput) return '';
    const now = new Date();
    const date = new Date(dateInput);
    const diffSec = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 0) {
      const absDiffSec = Math.abs(diffSec);
      const absMin = Math.round(absDiffSec / 60);
      const absHour = Math.round(absMin / 60);
      const absDay = Math.round(absHour / 24);
      if (absMin < 60) return `in ${absMin}m`;
      if (absHour < 24) return `in ${absHour}h`;
      return `in ${absDay}d`;
    }

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'yesterday';
    return `${diffDay}d ago`;
  };

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try {
      localStorage.setItem('proflow_read_notifications', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search projects, tasks..."
          className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setActiveDropdown((prev) => (prev === 'notifications' ? null : 'notifications'))}
            aria-haspopup="true"
            aria-expanded={activeDropdown === 'notifications'}
            aria-label="Notifications"
            className={`p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer ${
              activeDropdown === 'notifications' ? 'bg-slate-100 text-slate-800' : ''
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-300"></span>
            )}
          </button>

          {activeDropdown === 'notifications' && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-slate-500 mt-0.5">{unreadCount} unread</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <CheckCircle2 className="mx-auto text-emerald-500 mb-2 opacity-80" size={32} />
                  <p className="text-slate-700 font-semibold text-sm">You're all caught up</p>
                  <p className="text-slate-400 text-xs mt-0.5">No pending notifications</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((item) => {
                    const isUnread = !readIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 transition-colors flex items-start gap-3 ${
                          isUnread ? 'bg-primary-50/40 hover:bg-primary-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="mt-1 flex-shrink-0">
                          {item.type === 'overdue' ? (
                            <AlertCircle size={16} className="text-rose-500" />
                          ) : item.type === 'due-soon' ? (
                            <Clock size={16} className="text-amber-500" />
                          ) : (
                            <CheckSquare size={16} className="text-primary-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className={`text-xs font-bold truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                              {formatRelativeTime(item.time)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-1.5" title="Unread"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setActiveDropdown((prev) => (prev === 'profile' ? null : 'profile'))}
            aria-haspopup="true"
            aria-expanded={activeDropdown === 'profile'}
            aria-label="User menu"
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left focus:outline-none cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </button>

          {activeDropdown === 'profile' && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-200/50">
                  {user?.role}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/tasks"
                  role="menuitem"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <CheckSquare size={16} className="text-slate-400" />
                  <span>My Tasks</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setActiveDropdown(null);
                  dispatch(logout());
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <LogOut size={16} className="text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
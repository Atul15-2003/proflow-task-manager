import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProflowLanding from './pages/LandingPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {user && <Navbar />}
          <main className={`flex-1 ${user ? 'p-6' : ''}`}>
            <Routes>
              {/* Show Landing page on "/" for guests, or redirect to dashboard if logged in */}
              <Route 
                path="/" 
                element={!user ? <ProflowLanding /> : <Navigate to="/dashboard" replace />} 
              />

              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
              
              {/* Protected App Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />

              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Layout from './components/Layout/Layout';
import { useAuth } from './hooks/useAuth';
import ResearcherList from './components/Researcher/ResearcherList';
import { useEffect } from 'react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuth(state => state.isAuthenticated);
  const initialize = useAuth(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="researchers" element={<ResearcherList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

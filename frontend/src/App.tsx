import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import WaitingRoom from './components/WaitingRoom';
import Session from './components/Session';
import Result from './components/Result';
import Safety from './components/Safety';
import Philosophy from './components/Philosophy';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-route-in">
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/waiting" element={<WaitingRoom />} />
        <Route path="/session/:roomId" element={<Session />} />
        <Route path="/result/:roomId" element={<Result />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/philosophy" element={<Philosophy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

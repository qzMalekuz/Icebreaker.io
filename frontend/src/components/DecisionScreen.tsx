// DecisionScreen is no longer used — decision logic is handled inline by the Session screen.
// This file is kept as a redirect to avoid dead-link crashes if navigated to directly.
import { Navigate, useParams } from 'react-router-dom';

export default function DecisionScreen() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/session/${roomId}` : '/'} replace />;
}

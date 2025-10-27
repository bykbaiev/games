import { useNavigate } from 'react-router-dom';

import './styles.css';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="back-button"
      onClick={() => navigate('/')}
      aria-label="Go back to games list"
    >
      ← Back
    </button>
  );
};

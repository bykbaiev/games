import { BackButton } from '@/components/backButton';
import { KalahGameBoard } from '@/components/kalahGameBoard';

export const KalahPage = () => {
  return (
    <div className="kalah-game">
      <header>
        <BackButton />
        <h1>Kalah</h1>
      </header>
      <main>
        <KalahGameBoard />
      </main>
    </div>
  );
};

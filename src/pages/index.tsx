import { GameList } from '@/components/gameList';

export const EntryPage = () => {
  return (
    <>
      <header>
        <h1>Board Games Collection</h1>
      </header>
      <main>
        <GameList />
      </main>
    </>
  );
};

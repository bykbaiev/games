import GameList from './components/GameList';

import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Board Games Collection</h1>
      </header>
      <main>
        <GameList />
      </main>
    </div>
  );
}

export default App;

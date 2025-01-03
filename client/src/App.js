import React from 'react';
import RankingForm from './components/RankingForm.js';
import RankingList from './components/RankingList.js';

const App = () => {
  return (
    <div className="App">
      <h1>Program</h1>
      <div>
        <RankingForm />
      </div>
      <div>
        <RankingList />
      </div>
    </div>
  );
};

export default App;

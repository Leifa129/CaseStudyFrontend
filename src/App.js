import React from 'react';
import Register from './Register/Register';
import PersonList from './PersonList/PersonList';
import {Route} from 'react-router';

function App() {
  return (
      <div className="App">
        <Route exact path='/' component={Register}></Route>
        <Route path='/personer' component={PersonList}></Route>

      </div>

  );
}

export default App;

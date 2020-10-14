import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Calendar from './components/Calendar'
import Login from './components/Longin'
import Navegacion from './components/Navegacion'

function App() {
return (
      
      <Router>            
            <Navegacion/>
            <Route path='/login' ><Login/></Route> 
            <Route path='/'  exact ><Calendar/></Route>
      </Router> 
  );
}

export default App;

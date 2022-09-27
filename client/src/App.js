import './App.css';
import { useState } from 'react';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from './components/Home'
import Chat from './components/Chat'
import Toast from './components/Toast';

function App() {
  const [alert, setAlert] = useState(null)
  const showAlert=(type,message)=>{
       setAlert({
        msg:message,
        type:type
       })
       setTimeout(() => {
         setAlert(null)
       }, 1500);
  }
  return (
    
      <div className='App'>
        <Routes>
             <Route exact path='/' element={<Home showAlert={showAlert} key='home'/>} />
             <Route exact path='/chat' element={<Chat showAlert={showAlert} key='chat' />} />
        </Routes>
        <Toast alert={alert}  />
        </div>

  );
}

export default App;

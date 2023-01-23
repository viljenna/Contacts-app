import { store } from './redux/store';
import { Appbar, Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import Etusivu from './components/etusivu';
import LisaaUusi from './components/lisaaUusi';
import Lisatiedot from './components/lisatiedot';
import Poista from './components/poista';


const App : React.FC = () : React.ReactElement => {

 
  return (
    <Provider store={store}>
      <Appbar.Header>
        <Appbar.Content title="Yhteystiedot"></Appbar.Content>
      </Appbar.Header>
      <Etusivu/>
      <LisaaUusi/>
      <Lisatiedot/>
      <Poista/>
    </Provider>
  );
}

export default App;
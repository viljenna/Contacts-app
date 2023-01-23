import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, ScrollView, Pressable } from 'react-native';
import { Button, List } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { avaaLisatietoDialogi, avaaLisaysDialogi, haeYhteystiedot } from '../redux/yhteystiedotSlice';
import { Yhteystieto } from '../redux/yhteystiedotSlice';


const Etusivu : React.FC = () : React.ReactElement => {

  const haettu : React.MutableRefObject<boolean> = useRef(false);
  const dispatch : AppDispatch = useDispatch();
  const yhteystiedot : Yhteystieto[] = useSelector((state : RootState) => state.yhteystiedot.yhteystiedot)

  useEffect(() => {

    if (!haettu.current) {
      dispatch(haeYhteystiedot());
    }
        
    return () => { haettu.current = true }
  }, [dispatch]);

  return (
    <ScrollView style={{padding:20}}>
        <StatusBar style="auto" />
        
        
        {yhteystiedot !== undefined
        ? yhteystiedot
        .slice()
        .sort((a : any, b : any) => a.nimi > b.nimi ? 1 : -1)
        .map((yhteystieto : Yhteystieto, idx : number) => {
          return(<Pressable
                    key={idx}
                    onPress={() => dispatch(avaaLisatietoDialogi({auki: true, yhteystieto : yhteystieto}))}>
                   <List.Item
                      title={yhteystieto.nimi}
                    />
                  </Pressable>)
        })
      : <Text>Ei yhteystietoja</Text>
      }
      
        <Button
          mode='contained'
          style={{marginTop:20}}
          onPress={() => dispatch(avaaLisaysDialogi(true))}>Lisää yhteystieto</Button>
      </ScrollView>
  );
}

export default Etusivu;
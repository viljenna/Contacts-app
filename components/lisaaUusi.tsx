import React, { useState} from "react";
import { Button, Dialog, Portal, Provider, TextInput} from "react-native-paper";
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { avaaLisaysDialogi, lisaaYhteystieto, tallennaYhteystieto, Yhteystieto } from "../redux/yhteystiedotSlice";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const LisaaUusi : React.FC = () : React.ReactElement => {

    const [nimi, setNimi] = useState<string>("");
    const [numero, setNumero] = useState<string>("");
    const [osoite, setOsoite] = useState<string>("");

    const dispatch : AppDispatch = useDispatch();
    const lisaysDialogi : boolean = useSelector((state : RootState) => state.yhteystiedot.lisaysDialogi);

    const handleLisays = () : void => {
       
        let uusiYhteystieto : Yhteystieto = {
            id : uuidv4(),
            nimi : nimi,
            numero : numero,
            osoite : osoite,
        }
        dispatch(lisaaYhteystieto(uusiYhteystieto))
        dispatch(tallennaYhteystieto());
        dispatch(avaaLisaysDialogi(false))
    }
    
    return(
        <Provider>
            <Portal>
            <Dialog
                visible={lisaysDialogi}
                onDismiss={() => dispatch(avaaLisaysDialogi(false))}>
                    <Dialog.Title>Lisää yhteystieto</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Nimi"
                            onChangeText={(nimi : string) => setNimi(nimi)}
                            mode="outlined"/>
                        <TextInput
                            label="Puhelinnumero"
                            onChangeText={(numero : string) => setNumero(numero)}
                            mode="outlined"/>
                        <TextInput
                            label="Osoite"
                            onChangeText={(osoite : string) => setOsoite(osoite)}
                            mode="outlined"/>
                    
                    </Dialog.Content>
                    <Dialog.Actions
                        style={{justifyContent:"center"}}>
                        <Button
                            mode="contained"
                            onPress={handleLisays}
                            >Lisää yhteystieto
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => dispatch(avaaLisaysDialogi(false))}
                            >Peruuta
                        </Button>
                    </Dialog.Actions>
            </Dialog>

        </Portal>
        </Provider>
    )
}

export default LisaaUusi;
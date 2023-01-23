import React from "react"
import { Dialog, Text, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { avaaLisatietoDialogi, avaaPoistoDialogi, poistaYhteystieto, tallennaYhteystieto, Yhteystieto } from "../redux/yhteystiedotSlice";

const Poista : React.FC = () : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();
    const poistoDialogi : boolean = useSelector((state : RootState) => state.yhteystiedot.poistoDialogi.auki);
    const yhteystieto : Yhteystieto = useSelector((state : RootState) => state.yhteystiedot.poistoDialogi.yhteystieto);
    
    const handlePoisto = () : void => {
        dispatch(poistaYhteystieto(yhteystieto.id));
        dispatch(tallennaYhteystieto())
        dispatch(avaaPoistoDialogi({auki : false, yhteystieto : {}}))
        dispatch(avaaLisatietoDialogi({auki : false, yhteystieto : {}}))
    }
    
    return(
        <>
        <Dialog
            visible={poistoDialogi}>
            <Dialog.Title>Poista yhteystieto</Dialog.Title>
            <Dialog.Content>
                <Text>Haluatko varmasti poistaa yhteystiedon {yhteystieto.nimi}?</Text>
            </Dialog.Content>
            <Dialog.Actions
                style={{justifyContent:"space-evenly"}}>
                <Button
                    mode="contained"
                    onPress={handlePoisto}
                >Poista
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => dispatch(avaaPoistoDialogi({auki: false, yhteystieto: {}}))}
                >Peruuta
                </Button>
            </Dialog.Actions>
        </Dialog>
        </>
    )
}

export default Poista;
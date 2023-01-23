import React, { useState, useRef } from "react";
import { Button, Dialog, Portal, Provider, Text, FAB } from "react-native-paper";
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Yhteystieto, avaaLisatietoDialogi, avaaPoistoDialogi } from "../redux/yhteystiedotSlice";
import { Image, StyleSheet, View } from 'react-native';
import { Camera, CameraCapturedPicture } from 'expo-camera';

interface Kuvaustiedot {
    kuvaustila : boolean,
    virhe : string
    kuva? : CameraCapturedPicture
    info : string
  }

const Lisatiedot : React.FC = () : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();
    const lisatietoDialogi : boolean = useSelector((state : RootState) => state.yhteystiedot.lisatietoDialogi.auki);
    const yhteystieto : Yhteystieto = useSelector((state : RootState) => state.yhteystiedot.lisatietoDialogi.yhteystieto);
    const kameraRef : any = useRef<Camera>();

    const [kuvaustiedot, setKuvaustiedot] = useState<Kuvaustiedot>({
        kuvaustila : false,
        virhe : "",
        info : ""
      });

    const kaynnistaKamera = async () : Promise<void> => {
        
        const {status} = await Camera.requestCameraPermissionsAsync();
        if (status === "granted") {
            setKuvaustiedot({
                ...kuvaustiedot,
                kuvaustila : true,
                virhe : ""
            });
        } else {
            setKuvaustiedot({
                ...kuvaustiedot,
                kuvaustila : false,
                virhe : "Ei lupaa kameran käyttöön."
            });
        }
    }

    const otaKuva = async () : Promise<void> => {
        setKuvaustiedot({
            ...kuvaustiedot,
            info : "Odota hetki..."
        });

        const apuKuva: CameraCapturedPicture = await kameraRef.current.takePictureAsync();
        
        const formData : any = new FormData();
        formData.append("kuva", {
            uri : apuKuva.uri,
            name : `${yhteystieto.id}.jpg`,
            type : "image/jpeg"
        } as any)

        let url : string = "http://YOUR_IP_ADDRESS:3000/upload";
        let asetukset : any = {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
        
        await fetch(url, asetukset)
            .then((response) => response.json())
            .then((response) => {
                console.log("response", response)
            })
            .catch((err) => {
                console.log("error", err)
            })

        setKuvaustiedot({...kuvaustiedot, kuvaustila : false, info : ""})
    }

    return(
        <Provider>
            <Portal>
            {(kuvaustiedot.kuvaustila)
                ? <Camera 
                        ref={kameraRef}
                        style={styles.kameranakyma}>
                        {(Boolean(kuvaustiedot.info)) 
                        ? <Text style={{ color : "#fff"}}>{kuvaustiedot.info}</Text>
                        : null
                    }
                    <FAB 
                    icon="camera"
                    label="Ota kuva"
                    style={styles.nappiOtaKuva}
                    onPress={otaKuva}
                    />
                    <FAB 
                    icon="close"
                    label="Sulje"
                    style={styles.nappiSulje}
                    onPress={ () => setKuvaustiedot({...kuvaustiedot, kuvaustila : false})}
                    />
                </Camera>
            :
                    <Dialog
                        visible={lisatietoDialogi}
                        style={{alignItems:"center"}}
                        onDismiss={() => dispatch(avaaLisatietoDialogi({auki : false, yhteystieto : {}}))}>   
                            <Dialog.Title>{yhteystieto.nimi}</Dialog.Title>
                            <Dialog.Content>
                                <Text>Numero: {yhteystieto.numero}</Text>
                                <Text>Osoite: {yhteystieto.osoite}</Text>
                                <Image 
                                    source={{uri: `http://YOUR_IP_ADDRESS:3000/img/${yhteystieto.id}.jpg`}}
                                    style={styles.kuva}
                                 />
                            </Dialog.Content>
                            <Dialog.Actions>
                               <View
                                    >
                               <Button
                                    mode="contained"
                                    onPress={kaynnistaKamera}
                                    style={styles.nappi}
                                    >Lisää kuva käyttäjästä
                                </Button>
                                <Button
                                    mode="outlined"
                                    style={styles.nappi}
                                    onPress={() => dispatch(avaaLisatietoDialogi({auki : false, yhteystieto : {}}))}
                                    >Takaisin
                                </Button>
                                <Button
                                    mode="outlined"
                                    style={styles.nappi}
                                    onPress={() => dispatch(avaaPoistoDialogi({auki : true, yhteystieto : yhteystieto}))}
                                    >Poista yhteystieto
                                </Button>
                                </View>
                            </Dialog.Actions>
                    </Dialog>
}
                </Portal>
        </Provider>
    )
}

const styles = StyleSheet.create({
    kameranakyma : {
        flex: 1,
        alignItems : 'center',
        justifyContent: 'center'
      },
      nappiSulje : {
        position: 'absolute',
        margin: 20,
        bottom: 0,
        right: 0
      },
      nappiOtaKuva: {
        position: 'absolute',
        margin: 20,
        bottom: 0,
        left: 0
      },
      nappi : {
        marginTop:5
      },
      kuva: {
        width:200,
        height:200,
        borderRadius:100,
        marginTop:20,
        borderColor:"black",
        borderWidth:1
      }
})

export default Lisatiedot;

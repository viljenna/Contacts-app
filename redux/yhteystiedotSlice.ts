import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const haeYhteystiedot = createAsyncThunk("yhteystietolista/haeYhteystiedot", async() => {
    let response : any = [];

    await fetch("http://192.168.68.58:3000/api/yhteystiedot", {
        method : "GET"
    })
        .then((response) => response.json())
        .then((responseJSON) => {
             response = responseJSON
         })
         .catch((err : any) => console.log(err))

    return response;
})

export const tallennaYhteystieto = createAsyncThunk("yhteystietolista/tallennaYhteystieto", async (payload, {getState}) => {
     const yhteys = await fetch("http://192.168.68.58:3000/api/yhteystiedot", {
         method : "POST",
         headers  : {
             "Content-Type" : "application/json"
         },
         body : JSON.stringify(getState())
     });
    return await yhteys.json();
})


const yhteystiedot : Yhteystieto[] = [];

interface State {
    yhteystiedot : Yhteystieto[]
    lisaysDialogi : boolean
    lisatietoDialogi : {
        auki : boolean,
        yhteystieto : Yhteystieto
    }
    poistoDialogi : {
        auki : boolean,
        yhteystieto : Yhteystieto
    }
}

export interface Yhteystieto {
    id : string
    nimi : string
    numero : string
    osoite : string
}

export const yhteystiedotSlice = createSlice({
    name : "yhteystietolista",
    initialState : {
        yhteystiedot : [...yhteystiedot],
        lisaysDialogi : false,
        lisatietoDialogi : {
            auki : false,
            yhteystieto : {}
        },
        poistoDialogi : {
            auki : false,
            yhteystieto : {}
        }
    } as State,
    reducers : {
        avaaLisaysDialogi : (state : State, action : PayloadAction<boolean>) => {
            state.lisaysDialogi = action.payload;
        },
        avaaLisatietoDialogi : (state : State, action : PayloadAction<any>) => {
            state.lisatietoDialogi = action.payload;
        },
        avaaPoistoDialogi : (state : State, action : PayloadAction<any>) => {
            state.poistoDialogi = action.payload;
        },
        lisaaYhteystieto : (state : State, action : PayloadAction<any>) => {
            state.yhteystiedot = [...state.yhteystiedot, action.payload];
        },
        poistaYhteystieto : (state : State, action : PayloadAction<any>) => {
            state.yhteystiedot = [
                ...state.yhteystiedot.filter(
                    (yhteystieto : Yhteystieto) => yhteystieto.id !== action.payload
                ),
            ];
        }
    },
    extraReducers : (builder : any) => {
        builder.addCase(haeYhteystiedot.fulfilled, (state : State, action : PayloadAction<Yhteystieto[]>) => {
            state.yhteystiedot = action.payload;
        }).addCase(tallennaYhteystieto.fulfilled, (state : State, action : PayloadAction<any>) => {
            console.log("Tallennettu!");
        })
    }
});

export const { avaaLisaysDialogi, lisaaYhteystieto, avaaLisatietoDialogi, poistaYhteystieto, avaaPoistoDialogi } = yhteystiedotSlice.actions;

export default yhteystiedotSlice.reducer;
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';

const app : express.Application = express();
const portti : number = Number(3000);

const uploadKasittelija: express.RequestHandler = multer ({
    dest : path.resolve(__dirname, "tmp"),
}).single("kuva")


app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")))

app.get("/api/yhteystiedot", async (req : express.Request, res : express.Response) : Promise<void> => {
    let data : any[] = [];
    
    try {
        let jsonStr = await fs.readFile(path.resolve(__dirname, "data", "yhteystiedot.json"), {encoding : "utf-8"});
        data = JSON.parse(jsonStr);
        
    } catch (e : any) {
        res.json({virhe : "Tiedoston sisältö korruptoitunut. Tietojen lukeminen epäonnistui."})
    }
    
    res.json(data);
});


app.post("/api/yhteystiedot", async (req : express.Request, res : express.Response) : Promise<void>=> {

    await fs.writeFile(path.resolve(__dirname, "data", "yhteystiedot.json"), JSON.stringify(req.body.yhteystiedot.yhteystiedot , null, 2), {encoding : "utf-8"});

    res.json({});

});

app.post("/upload", async (req : express.Request, res : express.Response) : Promise<void>=> {

    uploadKasittelija(req, res, async (err : any) => {
        
        if (err instanceof multer.MulterError) {
            console.log(err);
        } else {
            if (req.file) {
                
                await fs.copyFile(path.resolve(__dirname, "tmp", String(req.file.filename)), path.resolve(__dirname, "public", "img", req.file.originalname))
                
            } else {
                console.log(req.body)
            }

            res.redirect("/")
        }
        
    })
});


app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin ${portti}`)
})
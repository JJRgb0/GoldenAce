import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
//import connection from './config/connection.js';
import homeRoutes from './routes/homeRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Permite requisições do React

app.use('/api', homeRoutes); // Adicione a rota da página principal

const PORT = 3000;

/*connection.connect((error)=>{
    if(error){
        console.log(error);
    }else{
        console.log("Conexão estabelecida com o banco de dados.");
        app.listen(PORT, ()=>{
            console.log(`Example app listening on port ${PORT}`)
        });
    }
});*/
app.listen(PORT, ()=>{
    console.log(`Example app listening on port ${PORT}`)
});

export default app;
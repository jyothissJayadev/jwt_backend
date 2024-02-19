import express from "express";
import cors from 'cors'
import morgan from "morgan";
import connectDb from "./database/conn.js";
import router from './routes/router.js'

const app= express()

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use('/api',router)

const port= process.env.PORT||8081;
connectDb().then(()=>{
    try{
        app.listen(port,()=>{
            console.log(`connnect to port http://localhost:${port}`)
      
        })
    }
    catch(error){
        console.log("connot connect to th server",error)
    }
}).catch(error=>{
    console.log("invalid db connection")
})


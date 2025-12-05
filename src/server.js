import express from 'express';
const app = express();
const port = 3000;

app.use(express());

app.get("/", (req, res)=>{
    res.send("bem vindo");
});

app.listen(port, ()=> {
    console.log(`server rodando em http://localhost:${port}`);
})
<<<<<<< HEAD
import app from "./app.js";
// será necessário fazer ajuste para conectar com o banco de dados.

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
=======
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
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b

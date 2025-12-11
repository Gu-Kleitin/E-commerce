import app from "./app.js";
// será necessário fazer ajuste para conectar com o banco de dados.

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

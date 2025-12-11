import mysql from "mysql2";

// Configurações de conexão:
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});

// Tentativa de conexão para debug:
db.connect((err) => {
  if (err) {
    // Se houver erro de credenciais ou banco não existir
    console.error("❌ Erro ao conectar ao MySQL:", err.stack);
    console.error(
      "Verifique se o MySQL está rodando e as credenciais (senha) estão corretas."
    );
  } else {
    console.log("✅ Conexão com MySQL estabelecida. ID:", db.threadId);
  }
});

// Exporta a conexão para ser usada em rotas e serviços
export default db;

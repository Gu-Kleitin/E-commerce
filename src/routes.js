import express from "express";
const router = express.Router();
import { ProductModel } from "./seller/models/product-models.js";

import mysql from 'mysql2'
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
});

// Mock de dados para simular a listagem do vendedor (para testes iniciais)
const mockProducts = [
  new ProductModel(
    101, //id
    "Notebook Gamer ZIZZ", // name
    "Processador i7, 16GB RAM, SSD 512GB", //discription
    "/images/notebook.png", // image
    5500.0, //price
    5, //stock
    true //inStock?
  ),
  new ProductModel(
    102,
    "Mouse Óptico Z",
    "Mouse ergonômico com 6 botões programáveis",
    "/images/mouse.png",
    150.0,
    25,
    true
  ),
  new ProductModel(
    103,
    "Teclado Mecânico",
    "Teclado RGB, switch blue",
    "/images/teclado.png",
    300.0,
    0,
    false // Fora de exposição
  ),
];

// Rota de Gestão de Produtos do Vendedor (seu foco)
router.get("/seller/products", (req, res) => {
  res.render("seller-products", {
    title: "Gestão de Produtos",
    usuario: req.session.usuario,
    cartItemCount: 2,
    produtos: mockProducts,
  });
});

// Rota Home Page (cliente)
router.get("/", (req, res) => {
  // 1. Filtra a lista mockada: pega apenas os produtos onde emExposicao é true
  const produtosVisiveis = mockProducts.filter((p) => p.emExposicao === true);

  res.render("home", {
    title: "Página Inicial E-commerce",
    usuario: req.session.usuario,
    cartItemCount: 2,
    produtosVisiveis: produtosVisiveis, // Passa a lista filtrada para o template
  });
});

// Rota Controle de estoque (vendedor)
router.post("/seller/products/toggle-exposure", (req, res) => {
  // req.body é populado graças ao middleware express.urlencoded() no app.js
  const { productId, action } = req.body;

  // Converte o ID para número (garantindo que seja um número para a comparação)
  const id = parseInt(productId);

  // 1. Encontra o produto no nosso mock de dados
  const produto = mockProducts.find((p) => p.id === id);

  if (produto) {
    // 2. Atualiza o status com base na ação enviada pelo formulário
    if (action === "expor") {
      produto.emExposicao = true;
      console.log(`Produto ID ${id} exposto.`);
    } else if (action === "retirar") {
      // Este é o cerne do Requisito 5
      produto.emExposicao = false;
      console.log(`Produto ID ${id} retirado de exposição.`);
    }
  }

  // 3. Redireciona o usuário de volta para a página GET (Post-Redirect-Get Pattern)
  res.redirect("/seller/products");
});

router.get("/account", (req, res) => {
  if (!req.session.usuario) {
        return res.send(`
            <script>
                alert("Você precisa estar logado!");
                window.location.href = "/login";
            </script>
        `);
  }
  res.render("account", {
    title: "Conta",
    usuario: req.session.usuario,
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
})
router.post("/login", (req, res) =>{
   const { email, senha } = req.body;

    const sql = `
        SELECT * FROM usuario 
        WHERE email = ? AND senha_hash = ?
    `;

    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error("Erro ao consultar:", err);
            return res.send("Erro no servidor!");
        }

        if (results.length === 0) {
            return res.send(`
                <script>
                    alert("Email ou senha incorretos!");
                    window.location.href = "/login";
                </script>
            `);
        }

        const usuario = results[0];
        req.session.usuario = usuario;

        res.send(`
            <script>
                alert("Bem-vindo, ${usuario.nome}!");
                window.location.href = "/";
            </script>
        `);
    });
})

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Cadastro_usuario",
  });
});
router.post("/register",(req,res) =>{
    const { nome, email, senha, vendedor } = req.body;

  const sql = `
    INSERT INTO usuario (nome, email, senha_hash, vendedor)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nome, email, senha, vendedor], (err, result) => {
    if (err) {
      console.log("Erro ao inserir:", err);
      return res.send("Erro ao cadastrar!");
    }
    res.send(`
      <script>
          alert("Cadastrado com sucesso!");
          window.location.href = "/login"; 
      </script>
`   );
  });
})
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.send(`
            <script>
                alert("Você saiu da sua conta!");
                window.location.href = "/";
            </script>
        `);
    });
});

export default router;

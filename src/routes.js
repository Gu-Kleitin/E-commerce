import express from "express";
const router = express.Router();
import { ProductModel } from "./seller/models/product-models.js";

// Mock de Categorias
const mockCategories = [
    { id: "eletro", name: "Eletrônicos" },
    { id: "computadores", name: "Computadores e Notebooks" },
    { id: "gamer", name: "Produtos Gamer" }
];

// Mock de dados para simular a listagem do vendedor (para testes iniciais)
const mockProducts = [
  new ProductModel(
    101, //id
    "Notebook Gamer ZIZZ", // name
    "Processador i7, 16GB RAM, SSD 512GB", //discription
    "/images/notebook.png", // image
    5500.0, //price
    5, //stock
    true, //inStock?
    ["eletro", "gamer","computadores"]
  ),
  new ProductModel(
    102,
    "Mouse Óptico Z",
    "Mouse ergonômico com 6 botões programáveis",
    "/images/mouse.png",
    150.0,
    25,
    true,
    ["eletro"]
  ),
  new ProductModel(
    103,
    "Teclado Mecânico",
    "Teclado RGB, switch blue",
    "/images/teclado.png",
    300.0,
    0,
    false, // Fora de exposição
    ["eletro", "gamer"]
  ),
];

// Rota de Gestão de Produtos do Vendedor (seu foco)
router.get("/seller/products", (req, res) => {
  res.render("seller-products", {
    title: "Gestão de Produtos",
    cartItemCount: 2,
    produtos: mockProducts,
  });
});

// Rota Home Page (cliente)
router.get("/", (req, res) => {
  const ordem = req.query.ordenar; // pegar ordenar=preco-asc
  const categoriaSelecionada = req.query.categoria; // Pega o filtro de categoria
  // 1. Filtra a lista mockada: pega apenas os produtos onde emExposicao é true
  let produtosVisiveis = mockProducts.filter((p) => p.emExposicao === true);

  if (ordem === "preco-asc") {
    produtosVisiveis.sort((a, b) => a.price - b.price);
  }
  if (ordem === "preco-desc") {
     produtosVisiveis.sort((a, b) => b.price - a.price); // 56
  }

  if (categoriaSelecionada) {
    produtosVisiveis = produtosVisiveis.filter(
        (p) => p.category.includes(categoriaSelecionada)
    );
  }

  res.render("home", {
    title: "Página Inicial E-commerce",
    cartItemCount: 2,
    produtosVisiveis: produtosVisiveis, // Passa a lista filtrada para o template
    ordemSelecionada: ordem,
    categorias: mockCategories, //Passa a lista de categorias
    categoriaSelecionada: categoriaSelecionada, //Mantém a opção selecionada
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

// Pesquisa de produtos
router.get("/search", (req, res) => {
  const termo = req.query.q?.toLowerCase() || "";

  // Filtra produtos cujo nome ou descrição contenham o termo
  const resultados = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(termo) ||
    p.description.toLowerCase().includes(termo)
  );

  res.render("search-results", {
    title: "Resultado da Pesquisa",
    termo: req.query.q,
    resultados,
  });
});

export default router;

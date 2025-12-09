import express from "express";
const router = express.Router();
import { ProductModel } from "./seller/models/product-models.js";

// Mock de dados para simular a listagem do vendedor (para testes iniciais)
const mockProducts = [
  new ProductModel(
    101, //id
    "Notebook Gamer ZIZZ", // name
    "Processador i7, 16GB RAM, SSD 512GB", //discription
    "/images/notebook.jpg", // image
    5500.0, //price
    5, //stock
    true //inStock?
  ),
  new ProductModel(
    102,
    "Mouse Óptico Z",
    "Mouse ergonômico com 6 botões programáveis",
    "/images/mouse.jpg",
    150.0,
    25,
    true
  ),
  new ProductModel(
    103,
    "Teclado Mecânico",
    "Teclado RGB, switch blue",
    "/images/teclado.jpg",
    300.0,
    0,
    false // Fora de exposição
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
  res.render("home", {
    title: "Página Inicial E-commerce",
    cartItemCount: 2,
  });
});

export default router;

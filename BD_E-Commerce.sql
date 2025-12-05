-- =======================================================
--  E-commerce - Esquema MySQL
-- =======================================================

DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce;

-- =======================================================
--  Tabela: Usuários
-- =======================================================
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    vendedor BOOLEAN NOT NULL DEFAULT FALSE
);

-- =======================================================
--  Tabela: Categoria (suporta categorias aninhadas)
-- a coluna mae_id referencia a categoria mae.
-- =======================================================
CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    mae_id INT NULL,
    FOREIGN KEY (mae_id) REFERENCES categoria(id)
);

-- =======================================================
--  Tabela: Produtos
-- =======================================================
CREATE TABLE produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendedor_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    foto_url VARCHAR(255),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (vendedor_id) REFERENCES usuario(id)
);

-- =======================================================
--  Tabela: Relação Produto ↔ Categoria (N:N)
-- =======================================================
CREATE TABLE produto_categoria (
    produto_id INT NOT NULL,
    categoria_id INT NOT NULL,
    PRIMARY KEY(produto_id, categoria_id),

    FOREIGN KEY (produto_id) REFERENCES produto(id),
    FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- =======================================================
--  Tabela: Movimentações de Estoque
-- =======================================================
CREATE TABLE estoque_movimentacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

-- =======================================================
--  Tabela: Pedidos
-- =======================================================
CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- =======================================================
--  Tabela: Itens do Pedido
-- =======================================================
CREATE TABLE item_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (pedido_id) REFERENCES pedido(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);
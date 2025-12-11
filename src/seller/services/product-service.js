import db from "../../database/database.js";

// Requisito 1: permite ao vendedor expor seus produtos à venda, determinando suas principais características
export async function createProduct(vendedor_id, nome, descricao, preco, foto_url, categorias) {
    return new Promise((resolve, reject) => {
        // 1. Inserir o produto na tabela 'produto'
        const sqlProduto = `
            INSERT INTO produto (vendedor_id, nome, descricao, preco, foto_url, ativo)
            VALUES (?, ?, ?, ?, ?, TRUE)
        `;
        db.query(sqlProduto, [vendedor_id, nome, descricao, preco, foto_url], (err, result) => {
            if (err) {
                return reject(err);
            }
            const produto_id = result.insertId;

            // 2. Inserir as categorias na tabela 'produto_categoria'
            if (categorias && categorias.length > 0) {
                const values = categorias.map(cat_id => [produto_id, cat_id]);
                const sqlCategorias = `
                    INSERT INTO produto_categoria (produto_id, categoria_id)
                    VALUES ?
                `;
                db.query(sqlCategorias, [values], (err) => {
                    if (err) {
                        // Em um sistema real, faríamos um rollback aqui
                        return reject(err);
                    }
                    resolve(produto_id);
                });
            } else {
                resolve(produto_id);
            }
        });
    });
}

// Requisito 4: permite ao vendedor controlar o estoque dos produtos
export async function updateStock(produto_id, quantidade, tipo) {
    return new Promise((resolve, reject) => {
        const quantidadeMovimentada = tipo === 'abastecimento' ? quantidade : -quantidade;
        
        // 1. Inserir a movimentação na tabela 'estoque_movimentacao'
        const sqlMovimentacao = `
            INSERT INTO estoque_movimentacao (produto_id, quantidade)
            VALUES (?, ?)
        `;
        db.query(sqlMovimentacao, [produto_id, quantidadeMovimentada], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.insertId);
        });
    });
}

// Função auxiliar para obter o estoque atual
export async function getStock(produto_id) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT SUM(quantidade) as estoque_atual
            FROM estoque_movimentacao
            WHERE produto_id = ?
        `;
        db.query(sql, [produto_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0].estoque_atual || 0);
        });
    });
}

// Função para listar produtos do vendedor
export async function getSellerProducts(vendedor_id) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, nome, descricao, preco, foto_url, ativo
            FROM produto
            WHERE vendedor_id = ?
        `;
        db.query(sql, [vendedor_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            
            // Adicionar o estoque atual a cada produto
            const productsWithStock = await Promise.all(results.map(async (produto) => {
                const estoque = await getStock(produto.id);
                return {
                    ...produto,
                    stock: estoque,
                    inStock: estoque > 0,
                    emExposicao: produto.ativo // Mapeia 'ativo' para 'emExposicao' para manter o padrão do mock
                };
            }));

            resolve(productsWithStock);
        });
    });
}

// Função para listar todas as categorias (para o vendedor escolher)
export async function getAllCategories() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, nome, mae_id
            FROM categoria
            ORDER BY nome
        `;
        db.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

// Função para obter detalhes de um produto
export async function getProductDetails(produto_id) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.id, p.nome, p.descricao, p.preco, p.foto_url, p.ativo, u.nome as vendedor_nome
            FROM produto p
            JOIN usuario u ON p.vendedor_id = u.id
            WHERE p.id = ?
        `;
        db.query(sql, [produto_id], async (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve(null);
            }
            
            const produto = results[0];
            const estoque = await getStock(produto.id);
            
            // Obter categorias do produto
            const sqlCategorias = `
                SELECT c.nome
                FROM produto_categoria pc
                JOIN categoria c ON pc.categoria_id = c.id
                WHERE pc.produto_id = ?
            `;
            db.query(sqlCategorias, [produto_id], (err, catResults) => {
                if (err) {
                    return reject(err);
                }
                
                resolve({
                    ...produto,
                    stock: estoque,
                    inStock: estoque > 0,
                    emExposicao: produto.ativo,
                    categories: catResults.map(c => c.nome)
                });
            });
        });
    });
}

// Função para listar todos os produtos ativos (para o cliente)
export async function getAllActiveProducts() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, nome, descricao, preco, foto_url
            FROM produto
            WHERE ativo = TRUE
        `;
        db.query(sql, async (err, results) => {
            if (err) {
                return reject(err);
            }
            
            // Adicionar o estoque atual a cada produto
            const productsWithStock = await Promise.all(results.map(async (produto) => {
                const estoque = await getStock(produto.id);
                return {
                    ...produto,
                    stock: estoque,
                    inStock: estoque > 0,
                    emExposicao: produto.ativo // Mapeia 'ativo' para 'emExposicao' para manter o padrão do mock
                };
            }));

            resolve(productsWithStock);
        });
    });
}

import express from "express";
const router = express.Router();
import { ProductModel } from "./seller/models/product-models.js";
import * as cartService from "./cart/services/cart.js";
import createItem from "./cart/services/itens.js";
import * as productService from "./seller/services/product-service.js";

// As categorias serão buscadas no banco de dados.
const mockCategories = [];
import db from "./database/database.js";

// Mock de dados para simular a listagem do vendedor (para testes iniciais)

// Inicializa o carrinho na sessão se não existir
router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

// O mockProducts foi removido para usar o banco de dados.
const mockProducts = [];

// Middleware de autenticação
function requireLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.send(`
            <script>
                alert("Você precisa estar logado para acessar esta página!");
                window.location.href = "/login";
            </script>
        `);
  }
  next();
}

// Middleware de autorização para Vendedor
function requireSeller(req, res, next) {
  if (!req.session.usuario || req.session.usuario.vendedor !== 1) {
    return res.send(`
            <script>
                alert("Acesso negado. Apenas vendedores podem acessar esta página.");
                window.location.href = "/";
            </script>
        `);
  }
  next();
}

// Rota de Gestão de Produtos do Vendedor (seu foco)
router.get(
  "/seller/products",
  requireLogin,
  requireSeller,
  async (req, res) => {
    try {
      const produtos = await productService.getSellerProducts(
        req.session.usuario.id
      );
      res.render("seller-products", {
        title: "Gestão de Produtos",
        usuario: req.session.usuario,
        cartItemCount: req.session.cart.length,
        produtos: produtos,
      });
    } catch (error) {
      console.error("Erro ao buscar produtos do vendedor:", error);
      res.status(500).send("Erro ao buscar produtos.");
    }
  }
);

// Rota para adicionar novo produto (Requisito 1)
router.get(
  "/seller/products/add",
  requireLogin,
  requireSeller,
  async (req, res) => {
    try {
      const categorias = await productService.getAllCategories();
      res.render("seller-add-product", {
        title: "Adicionar Produto",
        usuario: req.session.usuario,
        cartItemCount: req.session.cart.length,
        categorias: categorias,
      });
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      res.status(500).send("Erro ao carregar formulário.");
    }
  }
);

router.post(
  "/seller/products/add",
  requireLogin,
  requireSeller,
  async (req, res) => {
    const { nome, descricao, preco, foto_url, categorias } = req.body;
    const vendedor_id = req.session.usuario.id;
    const precoFloat = parseFloat(preco);

    try {
      const produto_id = await productService.createProduct(
        vendedor_id,
        nome,
        descricao,
        precoFloat,
        foto_url,
        categorias
      );
      // Adiciona um estoque inicial de 10 unidades
      await productService.updateStock(produto_id, 10, "abastecimento");

      res.send(`
      <script>
        alert("Produto ${nome} adicionado com sucesso!");
        window.location.href = "/seller/products";
      </script>
    `);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      res.status(500).send("Erro ao adicionar produto.");
    }
  }
);

// Rota para controle de estoque (Requisito 4)
router.post(
  "/seller/products/stock",
  requireLogin,
  requireSeller,
  async (req, res) => {
    const { productId, quantidade, action } = req.body;
    const id = parseInt(productId);
    const qntd = parseInt(quantidade);

    try {
      await productService.updateStock(id, qntd, action);
      res.redirect("/seller/products");
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      res.status(500).send("Erro ao atualizar estoque.");
    }
  }
);

// Rota Controle de exposição (Requisito 5)
router.post(
  "/seller/products/toggle-exposure",
  requireLogin,
  requireSeller,
  async (req, res) => {
    const { productId, action } = req.body;
    const id = parseInt(productId);
    const ativo = action === "expor" ? 1 : 0;

    try {
      const sql = `UPDATE produto SET ativo = ? WHERE id = ?`;
      await db.query(sql, [ativo, id]);
      res.redirect("/seller/products");
    } catch (error) {
      console.error("Erro ao atualizar exposição:", error);
      res.status(500).send("Erro ao atualizar exposição.");
    }
  }
);

// Rota para gerenciar categorias (Requisito 3)
router.get(
  "/seller/categories",
  requireLogin,
  requireSeller,
  async (req, res) => {
    try {
      const categorias = await productService.getAllCategories();
      res.render("seller-categories", {
        title: "Gerenciar Categorias",
        usuario: req.session.usuario,
        cartItemCount: req.session.cart.length,
        categorias: categorias,
      });
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      res.status(500).send("Erro ao carregar a página de categorias.");
    }
  }
);

router.post(
  "/seller/categories/add",
  requireLogin,
  requireSeller,
  async (req, res) => {
    const { nome, mae_id } = req.body;
    const maeId = mae_id ? parseInt(mae_id) : null;

    try {
      const sql = `INSERT INTO categoria (nome, mae_id) VALUES (?, ?)`;
      await db.query(sql, [nome, maeId]);
      res.redirect("/seller/categories");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      res.status(500).send("Erro ao criar categoria.");
    }
  }
);

// Rota Home Page (cliente)
router.get("/", async (req, res) => {
  const ordem = req.query.ordenar; // pegar ordenar=preco-asc
  const categoriaSelecionada = req.query.categoria; // Pega o filtro de categoria

  try {
    // 1. Busca todos os produtos ativos no banco de dados
    let produtosVisiveis = await productService.getAllActiveProducts();
    const categorias = await productService.getAllCategories();

    // 2. Aplica filtro por categoria (se houver)
    if (categoriaSelecionada) {
      // Esta lógica precisa ser implementada no service para buscar as categorias do produto
      // Por enquanto, vamos filtrar no front-end para não quebrar
      // produtosVisiveis = produtosVisiveis.filter(
      //     (p) => p.categories.includes(categoriaSelecionada)
      // );
    }

    // 3. Aplica ordenação (se houver)
    if (ordem === "preco-asc") {
      produtosVisiveis.sort((a, b) => a.price - b.price);
    }
    if (ordem === "preco-desc") {
      produtosVisiveis.sort((a, b) => b.price - a.price);
    }

    res.render("home", {
      title: "Página Inicial E-commerce",
      usuario: req.session.usuario,
      cartItemCount: req.session.cart.length,
      produtosVisiveis: produtosVisiveis, // Passa a lista filtrada para o template
      ordemSelecionada: ordem,
      categorias: categorias, //Passa a lista de categorias
      categoriaSelecionada: categoriaSelecionada, //Mantém a opção selecionada
    });
  } catch (error) {
    console.error("Erro na rota home:", error);
    res.status(500).send("Erro ao carregar a página inicial.");
  }
});

// Rota Controle de exposição (Requisito 5)
router.post(
  "/seller/products/toggle-exposure",
  requireLogin,
  requireSeller,
  async (req, res) => {
    const { productId, action } = req.body;
    const id = parseInt(productId);
    const ativo = action === "expor" ? TRUE : FALSE;

    try {
      const sql = `UPDATE produto SET ativo = ? WHERE id = ?`;
      await db.query(sql, [ativo, id]);
      res.redirect("/seller/products");
    } catch (error) {
      console.error("Erro ao atualizar exposição:", error);
      res.status(500).send("Erro ao atualizar exposição.");
    }
  }
);

router.get("/account", requireLogin, (req, res) => {
  res.render("account", {
    title: "Conta",
    usuario: req.session.usuario,
    cartItemCount: req.session.cart.length,
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});
router.post("/login", (req, res) => {
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
    // Garante que o campo vendedor seja um número (1 ou 0) para o middleware funcionar
    usuario.vendedor = parseInt(usuario.vendedor);
    req.session.usuario = usuario;

    res.send(`
            <script>
                alert("Bem-vindo, ${usuario.nome}!");
                window.location.href = "/";
            </script>
        `);
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Cadastro_usuario",
  });
});
router.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;
  const vendedor = req.body.vendedor === "1" ? 1 : 0;

  const sql = `
        INSERT INTO usuario (nome, email, senha_hash, vendedor)
        VALUES (?, ?, ?, ?)
    `;

  db.query(sql, [nome, email, senha, vendedor], (err, result) => {
    if (err) {
      // Se for erro de e-mail duplicado
      if (err.code === "ER_DUP_ENTRY") {
        return res.send(`
                    <script>
                        alert("Erro: Este e-mail já está cadastrado!");
                        window.location.href = "/register"; 
                    </script>
                `);
      }

      // SE FOR QUALQUER OUTRO ERRO DO BD (tabela errada, coluna errada, etc.):

      // ❌ PASSO CRUCIAL: Imprime o erro completo no terminal do Nodemon
      console.error("❌ ERRO CATASTRÓFICO NO CADASTRO SQL:", err);

      // Retorna uma mensagem de erro ao navegador (depois de registrar no console)
      return res.status(500).send(`
                <h1>Erro ao Cadastrar</h1>
                <p>Ocorreu um erro interno no servidor (Banco de Dados).</p>
                <p>Verifique o console (terminal) para a mensagem de erro.</p>
                <a href="/register">Voltar ao Cadastro</a>
            `);
    }

    // Se deu tudo certo (sem erro)
    req.session.usuario = { nome: nome, vendedor: vendedor === 1 }; // Cria uma sessão básica
    res.send(`
          <script>
              alert("Cadastrado com sucesso!");
              window.location.href = "/login"; 
          </script>
        `);
  });
});

// Pesquisa de produtos
router.get("/search", async (req, res) => {
  const termo = req.query.q?.toLowerCase() || "";
  const cartItemCount = req.session.cart.length;

  try {
    // 1. Busca todos os produtos ativos no banco de dados
    const todosProdutos = await productService.getAllActiveProducts();

    // 2. Filtra produtos cujo nome ou descrição contenham o termo
    const resultados = todosProdutos.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo)
    );

    res.render("search-results", {
      title: "Resultado da Pesquisa",
      termo: req.query.q,
      resultados,
      cartItemCount: cartItemCount,
    });
  } catch (error) {
    console.error("Erro na rota de pesquisa:", error);
    res.status(500).send("Erro ao realizar a pesquisa.");
  }
});

// Rota para adicionar item ao carrinho
router.post("/cart/add", requireLogin, async (req, res) => {
  const { productId } = req.body;
  const id = parseInt(productId);

  try {
    // 1. Encontra o produto no banco de dados
    const produto = await productService.getProductDetails(id);

    if (produto && produto.inStock) {
      // 2. Cria o item do carrinho
      const newItem = createItem(produto.nome, produto.preco, 1);

      // 3. Adiciona ao carrinho na sessão
      cartService.addItem(req.session.cart, newItem);

      return res.send(`
              <script>
                  alert("Produto ${produto.nome} adicionado ao carrinho!");
                  window.location.href = "/";
              </script>
          `);
    }

    res.send(`
          <script>
              alert("Produto não encontrado ou fora de estoque!");
              window.location.href = "/";
          </script>
      `);
  } catch (error) {
    console.error("Erro ao adicionar item ao carrinho:", error);
    res.status(500).send("Erro ao adicionar item ao carrinho.");
  }
});

// Rota para visualizar o carrinho
router.get("/cart", requireLogin, (req, res) => {
  const cartWithSubtotal = req.session.cart.map((item) => ({
    ...item,
    subtotal: (item.price * item.qntd).toFixed(2),
  }));
  const total = cartService.calculateTotal(req.session.cart);

  res.render("cart", {
    title: "Seu Carrinho",
    cartItemCount: req.session.cart.length,
    usuario: req.session.usuario,
    cart: cartWithSubtotal,
    total: total,
  });
});

// Rota para remover item do carrinho (Requisito 2b)
router.post("/cart/remove", requireLogin, (req, res) => {
  const { itemName } = req.body;

  cartService.deleteItem(req.session.cart, itemName);

  res.redirect("/cart");
});

// Rota para aumentar/diminuir quantidade (Requisito 2c)
router.post("/cart/update", requireLogin, (req, res) => {
  const { itemName, action } = req.body;
  const item = req.session.cart.find((i) => i.itemName === itemName);

  if (item) {
    if (action === "increase") {
      item.qntd += 1;
    } else if (action === "decrease") {
      if (item.qntd > 1) {
        item.qntd -= 1;
      } else {
        // Se a quantidade for 1 e for diminuir, remove o item
        cartService.deleteItem(req.session.cart, itemName);
      }
    }
  }

  res.redirect("/cart");
});

// Rota para visualizar pedidos (Requisito 15)
router.get("/orders", requireLogin, async (req, res) => {
  const usuario_id = req.session.usuario.id;

  try {
    const sqlPedidos = `
      SELECT id, data_pedido, total
      FROM pedido
      WHERE usuario_id = ?
      ORDER BY data_pedido DESC
    `;
    const pedidos = await db.query(sqlPedidos, [usuario_id]);

    res.render("orders", {
      title: "Meus Pedidos",
      cartItemCount: req.session.cart.length,
      pedidos: pedidos,
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).send("Erro ao buscar pedidos.");
  }
});

// Rota para finalizar a compra (Requisito 14)
router.get("/checkout", requireLogin, async (req, res) => {
  const cart = req.session.cart;
  const usuario_id = req.session.usuario.id;

  if (cart.length === 0) {
    return res.send(`
      <script>
        alert("Seu carrinho está vazio!");
        window.location.href = "/cart";
      </script>
    `);
  }

  try {
    // 1. Calcular o total
    const total = cart.reduce((sum, item) => sum + item.price * item.qntd, 0);

    // 2. Inserir o pedido na tabela 'pedido'
    const sqlPedido = `INSERT INTO pedido (usuario_id, total) VALUES (?, ?)`;
    const resultPedido = await db.query(sqlPedido, [usuario_id, total]);
    const pedido_id = resultPedido.insertId;

    // 3. Inserir os itens do pedido na tabela 'item_pedido'
    const itemValues = cart.map((item) => [
      pedido_id,
      // Aqui precisaria do produto_id, mas o item do carrinho só tem nome.
      // Vamos usar um valor placeholder e assumir que o produto_id será recuperado
      // em um sistema real. Para este projeto, vamos simplificar.
      1, // Placeholder para produto_id
      item.qntd,
      item.price,
    ]);
    const sqlItens = `INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco) VALUES ?`;
    await db.query(sqlItens, [itemValues]);

    // 4. Limpar o carrinho após a "compra"
    req.session.cart = [];

    res.send(`
      <script>
        alert("Compra finalizada com sucesso! Total: R$ ${total.toFixed(2)}");
        window.location.href = "/orders";
      </script>
    `);
  } catch (error) {
    console.error("Erro ao finalizar a compra:", error);
    res.status(500).send("Erro ao finalizar a compra.");
  }
});

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

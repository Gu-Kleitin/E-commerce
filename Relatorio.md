Dependências do Projeto

### ➤ Dependências Principais

Instalação:

```bash
npm install
```

| Dependência          | Finalidade                                                       |
| -------------------- | ---------------------------------------------------------------- |
| `express`            | Framework principal para criação do servidor web.                |
| `express-handlebars` | Renderização dinâmica de páginas via Handlebars.                 |
| `express-session`    | Gerenciamento de sessão do usuário.                              |
| `cookie-parser`      | Leitura e manipulação de cookies.                                |
| `cors`               | Controle de requisições de origens externas (opcional para SSR). |

---

### ➤ Dependências de Desenvolvimento

Instalação:

```bash
npm install nodemon --save-dev
```

| Dependência | Finalidade                                                     |
| ----------- | -------------------------------------------------------------- |
| `nodemon`   | Reinicia automaticamente o servidor durante o desenvolvimento. |

---

### ➤ Scripts de Execução

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

---

## 🗂️ 3. Estrutura de Pastas (MVC)

A aplicação está organizada segundo o padrão **MVC (Model-View-Controller)**, garantindo modularidade e escalabilidade.

| Diretório               | Responsabilidade                                                                |
| ----------------------- | ------------------------------------------------------------------------------- |
| **`src/`**              | Lógica geral do servidor (Node.js). Inclui `app.js`, `server.js`, `routes.js`.  |
| **`src/controllers/`**  | Controladores que tratam rotas e regras de negócio.                             |
| **`src/models/`**       | Modelos responsáveis pelas operações com o banco de dados (MySQL).              |
| **`src/services/`**     | Funções reutilizáveis e lógica adicional (ex.: carrinho, categorias).           |
| **`views/`**            | Templates Handlebars: páginas, layouts e partials.                              |
| **`public/`**           | Arquivos estáticos acessados pelo navegador: CSS, JS (incluindo AJAX), imagens. |
| **`BD_E-Commerce.sql`** | Arquivo contendo a estrutura completa do banco de dados.                        |

---

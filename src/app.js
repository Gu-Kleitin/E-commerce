import express from "express";
<<<<<<< HEAD
import { engine as exphbs } from "express-handlebars"; // Usando 'engine as exphbs' para importação ESM
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";

// Configuração para simular __dirname em módulos ES (type: "module")
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- 1. Configuração do Handlebars ---
// Usamos '..' para sair da pasta 'src' e encontrar 'views' na raiz do projeto.
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "..", "views", "layouts"),
    partialsDir: path.join(__dirname, "..", "views", "partials"),
    helpers: {
      // O helper "eq" é a sua função 'equalsHelper'
      eq: (arg1, arg2) => {
        return arg1 === arg2;
      },
      // Você pode adicionar outros helpers aqui, como o 'formatPrice' no futuro.
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "..", "views"));

// --- 2. Middlewares Para Processar Dados ---
app.use(express.json()); // Para requests com JSON
app.use(express.urlencoded({ extended: true })); // Para formulários
app.use(cookieParser());
// Servindo arquivos estáticos (CSS, JS de cliente, Imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, "..", "public"))); //Essa linha aqui elimina ter que usar /public/css... no main.handlebars por conta da utilização do express que vai entender o q tá no main.handlebars como E-COMMERCE/public/css/style.css e é o mesmo pro cart-ajax.js

// --- 3. Configuração de Sessão (Requisito OBRIGATÓRIO) ---
// Configuração para fazer a sessão durar "para sempre" (1 ano)
const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

app.use(
  session({
    secret: "seu-segredo-super-secreto-e-longo", // TROQUE ISTO
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: ONE_YEAR, // Cookie de longa duração
      httpOnly: true,
      secure: false, // Mudar para 'true' em produção com HTTPS
    },
  })
);

// --- 4. Rotas ---
import routes from "./routes.js";
app.use("/", routes);

export default app; // Usando export default para ser importado em server.js
=======
import router from "./routes";

function createApp(){
    const app = express();
    app.use(express.json());
    app.use("/api", router);
    app.use(cors());

    return app;
}

export default createApp;
function cors() {
    throw new Error("Função não implementada");
}
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b

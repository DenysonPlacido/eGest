// /workspaces/eGest/server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve todos os arquivos estáticos da pasta atual (index.html, js, css, imagens)
app.use(express.static(path.join(__dirname)));

// Rota raiz (opcional, mas garante que index.html seja servido)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Front rodando em http://localhost:${PORT}`);
});

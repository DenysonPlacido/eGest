# eGest — Sistema de Gestão Web

**eGest** é uma aplicação web modular para gestão de pessoas, empresas e usuários. Desenvolvido com Node.js, Express, PostgreSQL e frontend dinâmico, o sistema oferece autenticação JWT, exportação de dados, navegação SPA e integração com procedures SQL.

---

## 🚀 Funcionalidades

- 🔐 Autenticação com JWT
- 👥 Cadastro, consulta, edição e exclusão de pessoas
- 🏢 Gerenciamento de empresas e usuários
- 📄 Exportação de dados para CSV
- 📦 Backend com procedures PostgreSQL
- 🧭 Navegação modular via `adminHome.html`
- 🎨 Interface responsiva com Glassmorphism

---

## 🛠️ Tecnologias

| Camada       | Tecnologias                     |
|--------------|----------------------------------|
| Backend      | Node.js, Express, PostgreSQL     |
| Frontend     | HTML, CSS, JavaScript (modular)  |
| Segurança    | JWT (JSON Web Token)             |
| Deploy       | Vercel (Frontend e Backend)      |

---

## 📂 Estrutura do Projeto

```bash
├── Estrutura de arquivo.txt
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── UserHome.html
│   ├── admin_dashboard.html
│   ├── admin_novo_usuario.html
│   ├── cadastropessoa.html
│   ├── css
│   │   ├── CadastroPessoa.css
│   │   ├── erp.png
│   │   ├── styleAdminForms.css
│   │   ├── styleBase.css
│   │   ├── styleHeader.css
│   │   ├── styleIndexLogin.css
│   │   ├── styleMenuAdmin.css
│   │   └── styleUserHome.css
│   ├── header.html
│   ├── index.html
│   ├── js
│   │   ├── cadastropessoa.js
│   │   ├── main.js
│   │   ├── scriptIndexLogin.js
│   │   ├── scriptMenuAdmin.js
│   │   ├── scriptUserHome.js
│   │   └── session.js
│   ├── login.html
│   └── menu.html
├── server.js
├── src
│   ├── App.js
│   └── index.js
└── vercel.json


```

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```


### 2. Configurar variáveis de ambiente
Crie um arquivo .env com:
PORT=3000
DATABASE_URL=postgres://usuario:senha@host:porta/db
JWT_SECRET=sua_chave_secreta


### 3. Rodar o servidor
```bash
npm start
```


## 🔐 Autenticação JWT
- Após login, o backend retorna um token JWT
- O frontend armazena o token em localStorage
- Todas as requisições protegidas enviam o token no header:
Authorization: Bearer <token>



## 📦 API Principal
POST /api/pessoas/gerenciar
Gerencia ações de SELECT, UPDATE, DELETE via procedure SQL.

Body:
```js
{
  "acao": "SELECT",
  "nome": "João",
  "limit": 10,
  "offset": 0
}
```


### 📤 Exportação CSV

Na tela de consulta, os dados podem ser exportados com um clique em Exportar para Excel, gerando um arquivo .csv com os resultados filtrados.

### 📌 Autor

Desenvolvido por Denyson Deserto Plácido

📍 Campo Grande - MS, Brasil

### 📄 Licença

Este projeto está sob a licença MIT.




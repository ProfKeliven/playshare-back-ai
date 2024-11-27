const express = require('express');
const app = express();
const port = 3000;
var pool = require("./db").pool;
const bcrypt = require('bcrypt')

app.use(express.json())
app.use(express.static('public')) //usado quando acessamos html, css e js - arquivos estaticos e publicos

app.get('/', (req, res) =>{
  res.send('Servidor do playshare')
})

const cors = require("cors");
app.use(cors());

app.get('/cadastro', (req, res) =>{
  res.send('Servidor do para cadastro de usuario')
})
//rota de cadastro
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verificar se a senha foi fornecida
  if (!senha) {
    return res.status(400).send('Senha é obrigatória');
  }

  try {
    const emailExiste = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (emailExiste.rows.length > 0) {
      return res.status(400).send('E-mail já cadastrado');
    }

    // Criptografar a senha
    const hashSenha = await bcrypt.hash(senha, 10);

    // Inserir no banco de dados
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)', [nome, email, hashSenha]
    );
    res.status(201).send('Usuário cadastrado com sucesso');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Erro de servidor');
  }
});

//rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body

  try {
    //buscar o email do usuario
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
    const usuario = resultado.rows[0]
    if (!usuario) {
      return res.status(400).send('Usuário não encontrado')
    }
    console.log(senha); 
    if (!senha) {
      return res.status(400).send('Senha é obrigatória');
    }
    console.log(senha); 
    //verificar a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      return res.status(400).send('Senha incorreta')
    }
    res.send('Login efetuaco')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Erro de servidor')
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

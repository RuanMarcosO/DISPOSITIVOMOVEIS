const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: '192.168.0.109:3000',  // ou o IP do seu servidor MySQL
  user: 'root',       // usuário MySQL
  password: '',       // senha do MySQL
  database: 'cad_db'   // Nome do banco de dados atualizado
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
  
  // Teste simples para verificar a conexão
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Erro ao fazer a consulta inicial:', err);
    } else {
      console.log('Resultado da consulta de teste:', results);
    }
  });
});

// Rota para cadastro
app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  // Inserir dados na tabela 'cadastro'
  const query = 'INSERT INTO cadastro (nome, email, senha) VALUES (?, ?, ?)';
  db.query(query, [nome, email, senha], (err, result) => {
    if (err) {
      console.error('Erro ao gravar no banco de dados:', err);
      return res.status(500).json({ message: 'Erro ao salvar o cadastro.' });
    }
    res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
  });
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
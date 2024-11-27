Iniciar:

1. Instalar dependencias
npm install

2. Configurar doc db.js do banco de dados com os dados do seu postgres

3. Caso não tenha criado, criar o banco de dados postgres no PG Admin

CREATE TABLE usuarios(
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	senha VARCHAR(255) NOT NULL
);

### Descrição

Projeto de automação de testes para serviços (API) usando NodeJS, para compreender a estrutura e como validar na camada de serviços em NodeJS.

### Tecnologias utilizadas

- Node JS
- Mocha
- Chai
- Chai-http
- Babel-cli
- Babel-core
- Babel-preset-es2015
- Express
- nodemon
- Docker
- RabbitMQ
- MongoDB
- SMTP


### Pré-condições

- Instalar o nodejs
- Instalar o docker
- Instalar o framework Express
- Instalar o framework Nodemon
- Instalar o framework Mocha
- Instalar o framework Chai
- Instalar o framework Babel
- Criar e executar a imagem do MongoDB
  - docker run --name mongo -d -p 27017:27017 mongo
- Criar e executar a image do RabbitMQ
  - docker run -d --hostname rabbitmq --name rabbitmq -p 15672:15672 -p 5672:5672 -p 25676:25676 rabbitmq:3-management


### Clone do Projeto

git clone ""


### Configuração

npm install


### Execução

- Para levantar a aplicação na web:

node <nome_do_arquivo>

ex: node app.js

- Para executar os testes com mocha, deve configurar no arquivo Package.json, no scripts -> test, e colocar o "mocha --exit"

npm test


- Para exectuar subir a aplicação para os testes com o Babel, para interpretar os códigos do ES6, colocar no arquivo Package.json,no script -> start, e colocar o "babel-node app.js"

npm start
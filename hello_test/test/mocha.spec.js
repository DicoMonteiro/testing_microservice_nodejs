// Usando ES5
// var chai = require("chai");
// var chaiHttp = require("chai-http");

// Usando ES6
// o Mocha serve para estruturar o projeto executar os testes em JS (parecido com o  RSPEC em Ruby)
// o Chai serve para realizarmos as validações dos resultados esperados (usando assert, expetc, etc)
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

// Instanciar a API interna para validar o códigos unitários, não sendo possivel para consumo externo
const app = require("../app");
// Solicitando realizar requisições em API interna
const request = chai.request(app);
// Solicitando realizar requisiçoes em API externa
// const request = chai.request("http://localhost:4000")

const expect = chai.expect;

describe("suite", () => {
    
    it("meu primeiro teste", () => {
        expect(1).to.equals(1);
        console.log("meu primeiro teste.");
    }),

    it("deve retornar mensagem olá", (done) => {
        request
            .get("/hello")
            .end( (err, res) => {
            expect(res.body.message).to.equals("Olá, Nodejs com express.");
            done();
        })
    })


})

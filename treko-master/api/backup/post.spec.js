import chai from 'chai';
import chaiHttp from "chai-http";

// Usando o mongoose para inserir dados no banco
import modelTasks from '../models/task'

chai.use(chaiHttp);

const app = require("../app");

// Passando o agent para manter a conexão e executar todos os testes, não apenas 1 e desligat a conexão.
const request = chai.request.agent(app);

const expect = chai.expect;

describe('post', () => {
    context('quando eu cadastro uma tarefa', () => {
        let task = { title: "Estudar Mongoose", owner: "adrianobma@gmail.com", done: false }
        it('entao deve retornar 200', (done) => {
            request
                .post('/task')
                .send(task)
                .end( (err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data.title).to.be.an('string');
                    expect(res.body.data.owner).to.be.an('string');
                    expect(res.body.data.done).to.be.an('boolean');
                    expect(res.body.data.title).to.equal('Estudar Mongoose');
                    done();
                })
        })
    })

    context('quando nao informo o titulo', () => {
        let task = { title: "", owner: "adrianobma@gmail.com", done: false }
        it('entao deve retornar 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end( (err, res) => {
                    expect(res).to.has.status(400);
                    // console.log(res.body.errors.title.message)
                    // expect(res.body.data.title).to.be.an('string');
                    // expect(res.body.data.owner).to.be.an('string');
                    // expect(res.body.data.done).to.be.an('boolean');
                    expect(res.body.errors.title.message).to.equal('Oops! Title is required.');
                    done();
                })
        })
    })

    context('quando nao informo o dono', () => {
        let task = { title: "Testar aplicação", owner: "", done: false }
        it('entao deve retornar 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end( (err, res) => {
                    expect(res).to.has.status(400);
                    expect(res.body.errors.owner.message).to.equal('Oops! Owner is required.');
                    done();
                })
        })
    })

    context('quando a tarefa já existe', () => {
        let task = {title: "Planejar viagem para a China", owner: "adrianobma@gmail.com", done: false }
        before( (done) => {
            request
                .post('/task')
                .send(task)
                .end( (err, res) => {
                    expect(res).to.has.status(200);
                    done();
                })
        })

        it('entao deve retornar 409', (done) => {
            request
                .post('/task')
                .send(task)
                .end( (err, res) => {
                    expect(res).to.has.status(409);
                    // console.log(res.body)
                    expect(res.body.errmsg).to.contains('duplicate key');
                    expect(res.body.errmsg).to.include('duplicate key');
                    done();
                })
        })

    })
})
import chai from 'chai';
import chaiHttp from "chai-http";

// Usando o mongoose para inserir dados no banco
import modelTasks from '../models/task'

chai.use(chaiHttp);

const app = require("../app");

// Passando o agent para manter a conexão e executar todos os testes, não apenas 1 e desligat a conexão.
const request = chai.request.agent(app);

const expect = chai.expect;

describe('get', () => {
    context('quando eu tenho tarefas cadastradas', () => {
        before((done) => {

            let tasks = [
                {title: "Estudar NodeJs", owner: "adrianobma@gmail.com", done: false},
                {title: "Fazer compras", owner: "adrianobma@gmail.com", done: false},
                {title: "Estudar MongoDB", owner: "adrianobma@gmail.com", done: false},
            ]
            modelTasks.insertMany(tasks);
            done();
        })
    
        it('deve retornar uma lista', (done) => {

            request
                .get('/task')
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data).to.be.an('array');
                    done();
                })
        })

        it('deve filtrar por palavra chave', (done) => {

            request
                .get('/task')
                .query({ title: 'Estudar' })
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data[0].title).to.equal('Estudar NodeJs');
                    expect(res.body.data[1].title).to.equal('Estudar MongoDB');
                    done();
                })
        })

    })

    context('quando busco por id', () => {

        it('deve retornar uma única tarefa', (done) => {

            let tasks = [
                {title: "Ler um livro de Javascript", owner: "adrianobma@gmail.com", done: false}
            ]
            modelTasks.insertMany(tasks, (err,result) => {
                let id = result[0]._id

                request
                .get(`/task/${id}`)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data.title).to.equal(tasks[0].title);
                    done();
                })
            });
        })
    })

    context('quando a tarefa não existe', () => {
        it('deve retornar 404', (done) => {
            let id = require('mongoose').Types.ObjectId();

            request
            .get(`/task/${id}`)
            .end((err, res) => {
                expect(res).to.has.status(404);
                expect(res.body).to.eql({});
                done();
            })
        })
    })
})

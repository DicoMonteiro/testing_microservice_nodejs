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

    // Realiza a limpeza dos dados antes de executar os testes
    // before((done) => {
    //     modelTasks.deleteMany({});
    //     done();
    // })

    context('quando eu tenho tarefas cadastradas', () => {

        // Realiza a inserção dos dados antes de realizar os testes
        before((done) => {

            let tasks = [
                {title: "Estudar Robot Framework", email: "adrianobma@gmail.com", done: false},
                {title: "Estudar LaunchBase", email: "adrianobma@gmail.com", done: false},
                {title: "Estudar GoStack", email: "adrianobma@gmail.com", done: false},
                {title: "Fazer Excercios", email: "adrianobma@gmail.com", done: false},
                {title: "Estudar MongoDB", email: "adrianobma@gmail.com", done: false},
                {title: "Realizar Tarefas", email: "adrianobma@gmail.com", done: false}
            ]
            modelTasks.insertMany(tasks);
            done();
        })
    
        it('deve retornar uma lista', (done) => {

            request
                .get('/task')
                .end((err, res) => {
                    // Validando se o status code da response é 200
                    expect(res).to.has.status(200);
                    // console.log(res.bodys.data);
                    // Validando se o tipo de dado do body do response é uma lista
                    expect(res.body.data).to.be.an('array');
                    done();
                })
        })

        it('deve filtrar por palavra chave', (done) => {

            request
                .get('/task')
                .query({ title: 'Estudar' })
                .end((err, res) => {
                    // Validando se o status code da response é 200
                    expect(res).to.has.status(200);
                    // console.log(res.body.data);
                    // Validando se o tipo de dado do body do response é uma lista
                    expect(res.body.data[0].title).to.equal('Estudar Robot Framework');
                    expect(res.body.data[1].title).to.equal('Estudar LaunchBase');
                    expect(res.body.data[2].title).to.equal('Estudar GoStack');
                    expect(res.body.data[3].title).to.equal('Estudar MongoDB');
                    done();
                })
        })

    })

    context('quando busco por id', () => {

        it('deve retornar uma única tarefa', (done) => {

            let tasks = [
                {title: "Ler um livro de Javascript", email: "adrianobma@gmail.com", done: false}
            ]
            modelTasks.insertMany(tasks, (err,result) => {
                let id = result[0]._id

                request
                .get(`/task/${id}`)
                .end((err, res) => {
                    // Validando se o status code da response é 200
                    expect(res).to.has.status(200);
                    // console.log(res.body.data);
                    // Validando se o tipo de dado do body do response é uma lista
                    expect(res.body.data.title).to.equal(tasks[0].title);
                    done();
                })
            });
        })
    })

    context('quando a tarefa não existe', () => {
        it('deve retornar 404', (done) => {
            // Gerando um id do proprio mongodb aleatorio
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

import chai from 'chai';
import chaiHttp from "chai-http";

// Usando o mongoose para inserir dados no banco
import modelTasks from '../models/task'

chai.use(chaiHttp);

const app = require("../app");

// Passando o agent para manter a conexão e executar todos os testes, não apenas 1 e desligat a conexão.
const request = chai.request.agent(app);

const expect = chai.expect;

// Acessando uma API externa, no exemplo a API do RabbitMQ
const rabbitmq = chai.request('http://rabbitmq:15672');

describe('post', () => {
    context('quando eu cadastro uma tarefa', () => {
        let task = { title: "Estudar Mongoose", owner: "adrianobma@gmail.com", done: false }

        before((done) => {
            // Limpando a fila RabbitMQ antes de enviar a task
            rabbitmq
                .delete('/api/queues/%2F/tasksdev/contents')
                .auth('guest', 'guest')
                .end( (err, res) => {
                    expect(res).to.has.status(204);
                    done();
                })
        })

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

        it('e deve enviar um email', (done) => {

            let payload = { vhost: "/", name: "tasksdev", truncate: "50000", ackmode: "ack_requeue_true", encoding: "auto", count: "1"}

            // Acessando a fila para verificar se a mensagem a ser enviada por email, consumida pelo Consumer está correta ou não, sem precisar validar acessando o email.
            rabbitmq
                .post('/api/queues/%2F/tasksdev/get')
                .auth('guest', 'guest')
                .send(payload)
                .end( (err, res) => {
                    expect(res).to.has.status(200);
                    // console.log(res.body[0])
                    expect(res.body[0].payload).to.include(`Tarefa ${task.title} criada com sucesso!`);
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
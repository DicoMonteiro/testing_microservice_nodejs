import chai from 'chai';
import chaiHttp from "chai-http";

// Usando o mongoose para inserir dados no banco
import modelTasks from '../models/task'

chai.use(chaiHttp);

const app = require("../app");

// Passando o agent para manter a conexão e executar todos os testes, não apenas 1 e desligat a conexão.
const request = chai.request.agent(app);

const expect = chai.expect;


describe('delete', () => {
    
    context('quando apago uma tarefa', () => {

        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'Pagar a conta de celular',
            owner: 'adrianobma@gmail.com',
            done: false
        }

        before( (done) => {
            request
                .post('/task')
                .send(task)
                .end( (err, res) => {
                    expect(res).to.has.status(200);
                    done();
                })
        })

        it('entao deve retornar 200', (done) => {
            request
                .delete('/task/' + task._id)
                .end( (err,res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.eql({})
                    done()
                })
        })

        after( (done) => {
            request
            .get('/task/' + task._id)
            .end( (err,res) => {
                expect(res).to.have.status(404)
                done()
            })
        })
    })

    context('quando apago uma tarefa 2', () => {

        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'Pagar conta de luz',
            owner: 'adrianobma@gmail.com',
            done: false
        }

        before((done) => {
            modelTasks.insertMany([task], (error, docs) => {
                request
                    .delete('/task/' + task._id)
                    .end((err, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body).to.eql({})
                        done()
                    })
            })

        })

        it('então o retorno deve ser 404', (done) => {
            request
            .get('/task/' + task._id)
            .end((err, res) => {
                expect(res).to.have.status(404)
                done()
            })
        })
    })

    context('quando a tarefa nao existe', () => {
        it('deve retornar 200', (done) => {
            let id = require('mongoose').Types.ObjectId();
            request
                .delete('/task/' + id)
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    expect(res.body).to.eql({})
                    done()
                })
        })
    })

})

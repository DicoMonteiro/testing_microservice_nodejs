import chai from 'chai';
import chaiHttp from "chai-http";

// Usando o mongoose para inserir dados no banco
import modelTasks from '../models/task'

chai.use(chaiHttp);

const app = require("../app");

// Passando o agent para manter a conexão e executar todos os testes, não apenas 1 e desligat a conexão.
const request = chai.request.agent(app);

const expect = chai.expect;



describe('put', () => {
    
    context('quando eu altero uma tarefa', () => {

        let task = {
            // Gerando automaticamente o id a ser inserido no MongODB, pois ele permite, assim ficando independente de fazer um get para buscar o id na base de dados
            _id: require('mongoose').Types.ObjectId(),
            title: "Comprar fandangos",
            owner: "adrianobma@gmail.com",
            done: false
        }

        before((done) => {
            // Uso do insertMany, esta dando intermitencia, uma hora funciona ou não.
            // modelTasks.insertMany([task]);
            // done();
            request
                .post('/task')
                .send(task)
                .end( (err, res) => {
                    expect(res).to.has.status(200);
                    done();
                })
        })

        it('entao deve retornar 200', (done) => {
            task.title = 'Comprar baconzitos',
            task.done = true

            // console.log(task)

            // request
            //     .put('/task/' + task._id)
            //     .send(task)
            //     .end( (err, res) => {
            //         console.log(res.status);
            //         done();
            //     })

            request
                .put('/task/' + task._id)
                .send(task)
                .end( (err,res) => {
                    expect(res).to.has.status(200);
                    // console.log(res.body)
                    expect(res.body).to.eql({})
                    done();
                })

        })

        it('e deve retornar os dados atualizados', (done) => {
            request
            .get('/task/' + task._id)
            .end( (err,res) => {
                expect(res).to.has.status(200);
                expect(res.body.data.title).to.equal(task.title);
                expect(res.body.data.done).to.be.true
                done();
            })
        })
    })
})

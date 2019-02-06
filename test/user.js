//DURING THE TEST THE ENV VARIABLE IS SET TO TEST
process.env.NODE_ENV = 'test';

let mongoose = require ("mongoose");
let User = require ('../models/user');

//REQUIRE THE DEV_DEPENDENCIES
let chai = require('chai');
let chaiHttp = require ('chai-http');
let server = require ('../bin/www');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

let login_details = {
    'email': 'email@email.com',
    'password': '123@abc'
}

describe('Create Account, Login and Check Token', () => {
    beforeEach((done) => {
        //RESET THE USER MODE BEFORE EACH TEST
    User.deleteMany({}, (err) => {
        console.log(err);
        done();
        })
});

    describe('/POST Register', () => {
    it('it should Register, Login, and check token', (done) => {
        chai.request(server)
            .post('/api/signup')
            .send(login_details)//THIS IS LIKE SENDING $HTTP.POST OR THIS.HTTP.POST IN ANGULAR
            .end((err, res) => { //WHEN WE GET A RESPONSE FROM THE ENDPOINT
            //IN OTHER WORDS,
            //THE RES OBJECT SHOULD HAVE A STATUS OF 200
            res.should.have.status(200);
            //FOLLOW UP WITH LOGIN
    chai.request(server)
        .post('/api/signin')
        .send(login_details)
        .end((err, res) => {
            console.log('this was run the login part');
            res.should.have.status(200);
            expect(res.body.success).to.be.true;
            res.body.should.have.property('token');
            let token = res.body.token;
            //FOLLOW UP WITH REQUESTING USER PROTECTED PAGE
    chai.request(server)
        .get('/api/film')
    //WE SET THE AUTH HEADER WITH OUR TOKEN
        .set('Authorization', token)
        .end((err,res) => {
            console.log('Testing token');
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();//DONT FORGET DONE CALLBACK TO INDICATE WE ARE DONE
    })
    })
    })
    })
    })
});
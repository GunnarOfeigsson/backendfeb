//DURING THE TEST THE ENV VARIABLE IS SET TO TEST
process.env.NODE_ENV = 'test';

let mongoose = require ("mongoose");
let Film = require ('../models/film');

//REQUIRE THE DEV_DEPENDENCIES
let chai = require('chai');
let chaiHttp = require ('chai-http');
let server = require ('../bin/www');
let should = chai.should();

chai.use(chaiHttp);
//PARENT BLOCK
describe ('Film', () => {
    beforeEach((done) => { //Before each test we empty the database
        Film.deleteMany({}, (err) => {
            done();
        });
    });
    let ID;
    let testFilm = {
        "title": "Jurassic Park 2",
        "director": "Steven Spielberg",
        "studio": "Dreamworks",
        "year": "1998",
        "review": "dino excitment 3/5",
        "reviewer": "dave",
        "image": "./images/jp.png"
    };

    describe('/GET film', () => {
        it('it should GET all the films', (done) => {
            chai.request(server)
                .get('/api/film')
                .set({
                    Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWM1MDMzOTk5MGQ0NTAxMzA2M2RlOWM0IiwiZW1haWwiOiJndW5uYXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMDUkQ0ZlZFF3blhzbE1XckhyVmtMeVA3T0tqbDZmNm9IUXhUSUxTQS9DNWl0NGJJMWc3aTN6cWUiLCJjcmVhdGVkQXQiOiIyMDE5LTAxLTI5VDExOjA2OjAxLjc5MloiLCJ1cGRhdGVkQXQiOiIyMDE5LTAxLTI5VDExOjA2OjAxLjc5MloiLCJfX3YiOjAsImlhdCI6MTU0ODc1OTk3NX0.qU7Kjook-BuV959zkTq63kT8onvm7Z6g9Gv32jcmSoA'
                })
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

    });

    describe('/POST film', () => {
        it('it should Create a new film', (done) => {
            chai.request(server)
                .post('api/film')
                .send(testFilm)
                .set({
                    Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWM1MDMzOTk5MGQ0NTAxMzA2M2RlOWM0IiwiZW1haWwiOiJndW5uYXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMDUkQ0ZlZFF3blhzbE1XckhyVmtMeVA3T0tqbDZmNm9IUXhUSUxTQS9DNWl0NGJJMWc3aTN6cWUiLCJjcmVhdGVkQXQiOiIyMDE5LTAxLTI5VDExOjA2OjAxLjc5MloiLCJ1cGRhdGVkQXQiOiIyMDE5LTAxLTI5VDExOjA2OjAxLjc5MloiLCJfX3YiOjAsImlhdCI6MTU0ODc1OTk3NX0.qU7Kjook-BuV959zkTq63kT8onvm7Z6g9Gv32jcmSoA'
                })
                .end((err, res) => {
                    //console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.success.valueOf(true);
                    chai.request(server)
                        .get('/api/film')
                        .set({
                            Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicmVhZGVyIiwiX2lkIjoiNWM1MDMzOTk5MGQ0NTAxMzA2M2RlOWM0IiwiZW1haWwiOiJndW5uYXJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMDUkQ0ZlZFF3blhzbE1XckhyVmtMeVA3T0tqbDZmNm9IUXhUSUxTQS9DNWl0NGJJMWc3aTN6cWUiLCJjcmVhdGVkQXQiOiIyMDE5LTAxLTI5VDExOjA2OjAxLjc5MloiLCJ1cGRhdGVkQXQiOiIyMDE5LTAxLTI5VDExOjA2OjAxLjc5MloiLCJfX3YiOjAsImlhdCI6MTU0ODc1OTk3NX0.qU7Kjook-BuV959zkTq63kT8onvm7Z6g9Gv32jcmSoA'
                        })
                        .end((err, res) => {
                            ID = res.body[0]._id;
                            console.log(ID);
                            //console.log(res.body)
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(1);
                            done();
                        });
                });
        });
    })

})







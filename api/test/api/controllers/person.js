'use strict';
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

// app.js起動中も動作するよう、別app.jsインスタンスを立ち上げるようにする
process.env.PORT = 60010;

var server = require('../../../app');

describe('controllers', function() {

  describe('person', function() {

    describe('GET /v1/people', function() {

      it('should return people responses', function(done) {

        request(server)
          .get('/v1/people')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;

            expect(res.body).to.be.instanceof(Array);

            expect(res.body[0].personId).to.exist;
            expect(res.body[0].familyName).to.exist;
            expect(res.body[0].givenName).to.exist;
            expect(res.body[0].familyNameYomi).to.exist;
            expect(res.body[0].givenNameYomi).to.exist;
            expect(res.body[0].familyNameSort).to.exist;
            expect(res.body[0].givenNameSort).to.exist;

            expect(res.body[0]._works).to.not.exist;

            done();
          });
      });

      it('should accept family name parameter', function(done) {

        request(server)
          .get('/v1/people')
          // .query({ familyName: 'アーヴィング'})
          .query({ familyName: 'アーヴ'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;

            expect(res.body.length).to.equal(1);
            expect(res.body[0].familyName).to.equal('アーヴィング');

            done();
          });
      });

      it('should accept kana index parameter', function(done) {

        request(server)
          .get('/v1/people')
          .query({ index: 'あ'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;

            expect(res.body.length).to.equal(3);
            expect(res.body[0].familyName).to.equal('アーヴィング');

            done();
          });
      });

      it('should accept an embed parameter', function(done) {

        request(server)
          .get('/v1/people')
          .query({ embed: '_works'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;

            expect(res.body[0]._works.length).to.equal(3);
            expect(res.body[0]._works[0].title).to.equal('駅伝馬車');

            done();
          });
      });

      it('should accept a page parameter');

      it('should accept a limit parameter', function(done) {

        request(server)
          .get('/v1/people')
          .query({limit: '2'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            expect(err).to.not.exist;

            expect(res.body.length).to.equal(2);

            done();
          });
      });

    });

    describe('GET /v1/people/{personId}', function() {

      it('should return a person response', function (done) {

        request(server)
          .get('/v1/people/1257')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            expect(err).to.not.exist;

            expect(res.body.familyName).to.equal('アーヴィング');
            expect(res.body._works).to.not.exist;

            done();
          });
      });

      it('should accept an embed parameter', function (done) {

        request(server)
          .get('/v1/people/1257')
          .query({embed: '_works'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            expect(err).to.not.exist;

            expect(res.body._works.length).to.equal(3);
            expect(res.body._works[0].title).to.equal('駅伝馬車');

            done();
          });
      });

    });
  });

});

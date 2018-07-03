'use strict';
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

// app.js起動中も動作するよう、別app.jsインスタンスを立ち上げるようにする
process.env.PORT = 60010;

var server = require('../../../app');

describe('controllers', function() {

  describe('work', function() {

    describe('GET /v1/works', function() {

      it('should return works responses', function(done) {

        request(server)
          .get('/v1/works')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;

            expect(res.body).to.be.instanceof(Array);

            expect(res.body[0].workId).to.exist;
            expect(res.body[0].title).to.exist;
            expect(res.body[0].titleYomi).to.exist;
            expect(res.body[0].titleSort).to.exist;
            expect(res.body[0].copyright).to.exist;
            expect(res.body[0].cardUrl).to.exist;
            expect(res.body[0].personId).to.exist;
            expect(res.body[0].personRole).to.exist;
            expect(res.body[0].textUrl).to.exist;
            expect(res.body[0].textEncoding).to.exist;
            expect(res.body[0].textCharset).to.exist;
            expect(res.body[0].xmlUrl).to.exist;
            expect(res.body[0].xmlEncoding).to.exist;
            expect(res.body[0].xmlCharset).to.exist;

            expect(res.body[0]._person).to.not.exist;

            done();
          });
      });

      it('should accept a name parameter', function(done) {

        request(server)
          .get('/v1/works')
          // .query({ title: '駅伝馬車'})
          .query({ title: '馬車'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;

            expect(res.body.length).to.equal(1);
            expect(res.body[0].title).to.equal('駅伝馬車');

            done();
          });
      });

      it('should accept kana index parameter', function(done) {

        request(server)
          .get('/v1/works')
          .query({ index: 'え'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;

            expect(res.body.length).to.equal(1);
            expect(res.body[0].title).to.equal('駅伝馬車');

            done();
          });
      });

      it('should accept an embed parameter', function(done) {

        request(server)
          .get('/v1/works')
          .query({ embed: '_person'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;

            expect(res.body[0]._person).to.exist;
            expect(res.body[0]._person.familyName).to.equal('アーヴィング');

            done();
          });
      });

      it('should accept a page parameter');

      it('should accept a limit parameter', function(done) {

        request(server)
          .get('/v1/works')
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

    describe('GET /v1/works/{workId}', function() {

      it('should return a work response', function (done) {

        request(server)
          .get('/v1/works/56078')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            expect(err).to.not.exist;

            expect(res.body.title).to.equal('駅伝馬車');
            expect(res.body._person).to.not.exist;

            done();
          });
      });

      it('should accept an embed parameter', function (done) {

        request(server)
          .get('/v1/works/56078')
          .query({embed: '_person'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            expect(err).to.not.exist;

            expect(res.body._person).to.exist;
            expect(res.body._person.familyName).to.equal('アーヴィング');

            done();
          });
      });

    });
  });

});

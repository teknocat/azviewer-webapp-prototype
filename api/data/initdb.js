// @flow

"use strict";

// http://www.jonxie.com/blog/2014/10/12/how-to-seed-mongodb-with-node-dot-js-from-command-line/
import async from 'async';

import crypto from 'crypto';

const databaseURL = 'mongodb://localhost/azviewer';

import {MongoClient} from 'mongodb';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.set('debug', false);

import fs from 'fs';
import swaggerMongoose from 'swagger-mongoose';
const swagger = fs.readFileSync('api/swagger/swagger.json');
const compiled = swaggerMongoose.compile(swagger);

// 保存時の初期処理を行いたい場合には以下の処理を書いていく
// 上記URL参照
const personSchema = compiled.schemas.Person;
// TODO 動作しない
// personSchema.pre('save', function(next, err) {
//   console.log('save!');
// });

// console.log(personSchema);

// var Person = compiled.models.Person;
const Person = mongoose.model('Person', personSchema);
const Work = compiled.models.Work;
const Favorite = compiled.models.Favorite;
const User = compiled.models.User;

// ユーザのテスト用データ

import bcrypt from 'bcrypt';
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const generatePassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const createUserId = () => { return crypto.randomBytes(20).toString('hex') };

const testUserData = [
  {
    userId: createUserId(),
    userName: "username",
    screenName: "test user",
    role: "user",
    password: generatePassword("wsqNWpJ8")
  },
  {
    userId: createUserId(),
    userName: "username2",
    screenName: "test user",
    role: "user",
    password: generatePassword("HjXjvbNe")
  },
];

// ID自動発行
// https://scotch.io/tutorials/speed-up-your-restful-api-development-in-node-js-with-swagger
// TODO controller側とメソッドまとめたい
// TODO 本当はモデルのフック処理に入れたいが、swaggerとの組み合わせでhookが動かないようだ
const createFavoriteId = () => { return crypto.randomBytes(20).toString('hex') };

// お気に入りのテスト用データ
// TODO 最終的にはユーザの持ち物なので、作品更新ではクリアしないようにする必要がある
const testFavoriteData = [
  {favoriteId: createFavoriteId(), userId: testUserData[0]['userId'], workId: 56078},
  {favoriteId: createFavoriteId(), userId: testUserData[0]['userId'], workId: 56033},
  {favoriteId: createFavoriteId(), userId: testUserData[1]['userId'], workId: 46658},
];

// CSV解析
import parse from 'csv-parse';

const listPersonCsvPath = 'data/list_person_all_extended_utf8.csv';
// const listPersonCsvPath = 'data/test.csv';

let workCsv = [];
let personCsv = [];

const parser = parse({delimiter: ',', columns: true});
parser.on('data', data => {
  let newWork = {
    workId:       data['作品ID'],
    title:        data['作品名'],
    titleYomi:    data['作品名読み'],
    titleSort:    data['ソート用読み'],
    copyright:    data['作品著作権フラグ'] === 'あり',
    cardUrl:      data['図書カードURL'],
    personId:     data['人物ID'],
    personRole:   data['役割フラグ'],
    textUrl:      data['テキストファイルURL'],
    textEncoding: data['テキストファイル符号化方式'],
    textCharset:  data['テキストファイル文字集合'],
    xmlUrl:       data['XHTML/HTMLファイルURL'],
    xmlEncoding:  data['XHTML/HTMLファイル符号化方式'],
    xmlCharset:   data['XHTML/HTMLファイル文字集合'],
  };

  // 校訂者は除外
  // 同一作品でも校訂者が別にいる場合は複数レコード出てくるため
  if (newWork.personRole === "校訂者") {
    return;
  }

  // 翻訳者は除外
  // 同一作品でも翻訳者が別にいる場合は複数レコード出てくるため
  if (newWork.personRole === "翻訳者") {
    return;
  }

  // 作品登録済のものは除外
  // ペンネームと本名両方が著者として現れるため。この場合、先に出てきた方を著者とする。
  // TODO ペンネームと本名両方を著者として管理したい。データ的にはどっちが本名かわからない http://www.aozora.gr.jp/cards/000933/card45497.html
  if (workCsv.some(o => o.workId === newWork.workId)) {
    return;
  }

  workCsv.push(newWork);

  if (!personCsv.some(o => o.personId === newWork.personId)) {
    let newPerson = {
      personId:       newWork.personId,
      familyName:     data['姓'],
      givenName:      data['名'],
      familyNameYomi: data['姓読み'],
      givenNameYomi:  data['名読み'],
      familyNameSort: data['姓読みソート用'],
      givenNameSort:  data['名読みソート用'],
    };
    personCsv.push(newPerson);
  }
});
parser.on('error', err => {
  console.error(err);
  process.exit(1);
});
parser.on('finish', () => {
  // console.log(workCsv);
  // console.log(personCsv);

  dbSeed();
});

console.log('CSV parse');

fs.createReadStream(listPersonCsvPath).pipe(parser);

function dbSeed() {
  console.log('db seed')
  // Async series method to make sure asynchronous
  // calls below run sequentially
  async.series([

      callback => {

        MongoClient.connect(databaseURL, (err, db) => {

          if (err) throw err;

          // Drop database which is an asynchronous call
          db.dropDatabase((err, result) => {

            // After successfully dropping database, force
            // close database which is another asynchronous call
            db.close(true, (err, result) => {

              // Close successful so execute callback so second
              // function in async.serial gets called
              callback(null, 'SUCCESS - dropped database');
            });
          });
        });
      },

      callback => {

        // Open connection to MongoDB
        mongoose.connect(databaseURL);

        // Need to listen to 'connected' event then execute callback method
        // to call the next set of code in the async.serial array
        mongoose.connection.on('connected', () => {
          console.log('db connected via mongoose');

          // Execute callback now we have a successful connection to the DB
          // and move on to the third function below in async.series
          callback(null, 'SUCCESS - Connected to mongodb');
        });
      },

      callback => {
        Person.insertMany(personCsv, () => {
          callback(null, 'SUCCESS - People')
        })
      },

      callback => {
        async.eachSeries(
          workCsv,
          (work, workSavedCallBack) => {

            // console.log(work)
            Person.find({personId: work.personId}, (err, people) => {
              if (err) {
                console.log(err);
              }
              // console.log(people)

              const workModel = new Work(work)
              if (people.length === 1) {
                workModel._person = people[0]._id
              }
              // console.log(workModel)

              workModel.save(err => {
                if (err) {
                  // Send JSON response to console for errors
                  console.dir(err);
                }

                // console.log("Saving work #%s", work.name);

                workSavedCallBack();
              })
            })

          },

          err => {

            if (err) console.dir(err);

            callback(null, 'SUCCESS - Works');

          }
        );
      },

      callback => {
        Person.find()
          .exec((err, people) => {
            if (err)
              console.log(err);

            // http://stackoverflow.com/questions/16119855/loop-with-asynchronous-callbacks-in-mongoose-mongodb-node
            async.map(people, (person, done) => {
              Work.find({ personId: person.personId }, (err, work) => {
                person._works = work.map(w => w._id);
                person.save(() => {
                  done(null, person);
                })
              });
            }, (err, personArray) => {
              // console.log(personArray)
              callback(null, 'SUCCESS - Works -> Person');
            })
          })
      },


      callback => {
        console.log(testFavoriteData);
        Favorite.insertMany(testFavoriteData, () => {
          callback(null, 'SUCCESS - Favorites (for test)')
        })
      },

      callback => {
        Favorite.find()
          .exec((err, favorites) => {
            if (err)
              console.log(err);

            async.map(favorites, (favorite, done) => {
              Work.find({ workId: favorite.workId }, (err, work) => {
                if (work.length === 1) {
                  favorite._work = work[0]._id
                }
                // 作品内の作者も結びつける
                Person.find({ personId: favorite._work.personId }, (err, person) => {
                  if (person.length === 1) {
                    favorite._work._person = person[0]._id
                  }
                  favorite.save(() => {
                    done(null, favorite);
                  })
                });
              });

            }, (err, favoriteArray) => {
              callback(null, 'SUCCESS - Works -> Favorite');
            })
          })
      },

      callback => {
        console.log(testUserData);
        User.insertMany(testUserData, err => {
          if (err)
            console.log(err);

          callback(null, 'SUCCESS - Users (for test)')
        })
      },

    ],

    (err, results) => {

      console.log("\n\n--- Database seed program completed ---");

      if (err) {
        console.log("Errors = ");
        console.dir(err)
      } else {
        console.log("Results = ");
        console.log(results);
      }

      console.log("\n\n--- Exiting database seed program ---");
      // Exit the process to get back to terrminal console
      process.exit(0);
    });
}

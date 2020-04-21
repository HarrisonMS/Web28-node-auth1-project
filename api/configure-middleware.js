const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions)
const knex = require('../data/dbConfig');

const sessionConfiguration = {
  name: 'chocychip',
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
  resave: false,
  saveUninitialized: process.env.SEND_COOKIES || true,
  store: new KnexSessionStore({
    knex,
    createtable: true,

    clearInterval: 1000 * 50 * 10,
    sidfieldname: 'sid',
    tablename: 'auth',
  }),
  cookie: {
    maxAge: 100 * 60 * 10,
    secure: false,
    httpOnly: true,
  },
};

module.exports = server => {
  server.use(sessions(sessionConfiguration))
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
}
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { parse } = require('uuid');

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env' })
const db = require('./db')
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = 'Project0';

const index = require('./index.js')



const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/search',async (request, response) => {
  const database = await db.getDB()
  const collection = database.collection('products')

  let page=1;
  let size=12;

  if (request.query.page && parseInt(request.query.page)>=1 && parseInt(request.query.page)<= 10000){
    page=parseInt(request.query.page);
  }

  if (request.query.size && parseInt(request.query.size)>=1 && parseInt(request.query.size)<= 48){
    size=parseInt(request.query.size);
  }

  prod = await collection.find({}).limit(size).skip((page-1)*size).toArray()
  //console.log(prod)
  response.send(prod)
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env' })
const db = require('./db')
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = 'Project0';
const products = require('./products.json');

const connect = async () => {
    await db.insert(products)
}

connect()
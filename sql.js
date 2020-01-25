/* jshint node: true */
'use strict';

const pg     = require('pg');
const util   = require('util');
const logger = require('./services/logger.service').getLogger();

const dbConfig = require('./configs/dev.config').database;

const pool = new pg.Pool({
    host: dbConfig.host,
    user: dbConfig.username,
    database: dbConfig.db,
    password: dbConfig.password,
    port: dbConfig.port,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 200000
});

pool.on('error', (err, client) => {
    logger.error('[error] Unexpected error on idle client: %s', err);
});

logger.info('[sql] connecting to: %s@%s:%s', dbConfig.db, dbConfig.host, dbConfig.port);

pool.on('error', (err, client) => {
    logger.error('[error] Unexpected error on idle client: %s', err);
    //process.exit(-1)
});

logger.info('[sql] connecting to: %s@%s:%s', dbConfig.db, dbConfig.host, dbConfig.port);
module.exports = {
    executeQuery: function (query, callback) {
        pool.connect((err, client, done) => {
            if (err) throw err;
            client.query(query, (err, result) => {
                done();
                if (err) {
                    logger.info('[db] %s ', query);
                    logger.info('[db] %s', err.stack);
                    return callback(null);
                } else {
                    logger.info('[db] returned %d rows | %s', result.rowCount, query);
                    //result.rows = utils.encodeDataObject(result.rows, false);
                    return callback(result.rows, result.rowCount);
                }
            })
        })
    }
};
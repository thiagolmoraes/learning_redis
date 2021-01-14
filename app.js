const express = require('express');
const app = express();
const path = require('path')
const port = 3000
const redis = require("redis")
const body = require("body-parser")
const client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

app.use(body.urlencoded({ extended: false }))
app.use(body.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/queue.html'));
});

app.post('/save', async(req, res) => {
    try {
        client.rpush('queue', req.body.queue, function(err, reply) {
            if (err) throw err;

            res.status(200).send("Value Insert in Queue");
        });
    } catch (error) {
        console.log(error)
    }
});

app.get('/redis', async(req, res) => {
    try {
        client.lrange('queue', 0, -1, function(err, reply) {
            if (err) throw err;

            res.status(200).send(reply);
        })
    } catch (error) {
        console.log(error);
    }
});

app.delete('/clearAll', async(req, res) => {
    try {
        client.flushall(function(err, success) {
            if (err) throw err;
            res.status(200).send("Delete All Items");
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`WebServer listening at ${port}`);
});
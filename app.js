var Ddos = require('ddos')
var ddos = new Ddos;
var express = require('express')
var app = express();
var Q = require('q');
var db = require('./db');
var bodyParser = require('body-parser');
var request = require("request");



function extendeToken(token) {


    url = 'https://graph.facebook.com/oauth/access_token?client_id=1392536030762771&client_secret=c09a0c65794794e351accd53b543ee6c&grant_type=fb_exchange_token&fb_exchange_token=' + token;
    // return new pending promise
    return new Promise((resolve, reject) => {
        // select http or https module, depending on reqested url
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(chunk));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => resolve(body.join('')));
        });
        // handle connection errors of the request
        request.on('error', (err) => reject(err))
    })





}



app.use(ddos.express)
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/health', function (req, res) {
    res.sendStatus(200);
})

app.get('/', function (req, res) {
    res.render('index');
})

app.post('/adicionaUsuario', function (req, res) {
    var user = {};
    user.nome = req.body.name;
    user.id = req.body.id;
    user.token = req.body.token;

    extendeToken(req.body.token)
        .then((token) => {
            user.token = token.substring(13, token.indexOf('&'));
            db.adicionaUsuarioFacebook(user)
            res.send(req.body)
        })


})




app.post('/adicionarParticipante', function (req, res) {
    var user = {};

    user.nome = req.body.nome;
    user.email = req.body.email;
    user.telefone = req.body.telefone;
    user.celular = req.body.celular;
    user.cidade = req.body.cidade;
    user.bairro = req.body.bairro;
    user.estado = req.body.estado;
    user.motivo = req.body.motivo;

    db.adicionaUsuario(user);
    res.sendStatus(200);

})

app.post('/enviarLink', function (req, res) {
    console.log('banana', req.body)

})

app.get('/compartilharlink', function (req, res) {
    db.listarTodosUsuariosFacebook()
        .then((pessoas) => {
            console.log('banana', pessoas);
            res.render('compartilhar', { pessoas: pessoas });
        })

})

app.get('/listarPessoas', function (req, res) {

    db.listarTodosUsuariosFacebook()
        .then((pessoas) => {
            console.log('banana', pessoas);
            res.json(pessoas)
        })
})

app.listen(process.env.NODE_PORT || 3000, function () {
    console.log(`Express Application worker ${process.pid} started...`);
});

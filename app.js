var Ddos = require('ddos')
var ddos = new Ddos;
var express = require('express')
var app = express();
var Q = require('q');
var db = require('./db');
var bodyParser = require('body-parser');
var request = require("request");


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

    db.adicionaUsuarioFacebook(user)
    console.log(req.body)
    res.send(req.body)
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

app.post('/enviarLink',function (req,res) {
    console.log('banana',req.body)
    
})

app.get('/compartilharlink', function (req, res) {
    db.listarTodosUsuariosFacebook()
        .then((pessoas) => {
            console.log('banana', pessoas);
            res.render('compartilhar',{pessoas: pessoas});
        })

})

app.get('/listarPessoas', function (req, res) {

    db.listarTodosUsuariosFacebook()
        .then((pessoas) => {
            console.log('banana', pessoas);
            res.json(pessoas)
        })
})

app.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
    console.log(`Express Application worker ${process.pid} started...`);
});

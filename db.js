var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var Schema = mongoose.Schema;
// mongoose.connect(process.env.MONGODB_URL + 'concursoIphone', { db: { nativeParser: true } });
mongoose.connect('mongodb://lucao:bonitao@104.131.57.224/facebook');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Banco com problemas, error:'));
db.once('open', function () {
    console.log('Banco conectado com sucesso');
    // we're connected!
    //mongoose.connection.db.dropDatabase();
});


var usuarioSchema = new Schema({
    nome: String,
    email: String,
    telefone: Number,
    celular: { type: Number, unique: true },
    cidade: String,
    bairro: String,
    estado: String,
    motivo: String,
    date: { type: Date, default: Date.now },
});

var usuarioModel = mongoose.model('usuario', usuarioSchema)

var adicionaUsuario = function (usuario) {
    usuarioModel.findOneAndUpdate({ celular: usuario.celular }, usuario, { upsert: true })
        .then(console.log('usuario adicionado com sucesso'))
        .catch((err) => console.log('Erro ao adicionar usuario', err))

}

var listarTodosUsuarios = function () {
    usuarioModel.find()
        .then((info) => console.log('\n\n', info, '\n\n'))
}

module.exports = {
    adicionaUsuario: adicionaUsuario,
    listarTodosUsuarios: listarTodosUsuarios
}
// db.createUser({ user: 'lucao', pwd: 'bonitao', roles: [ { role: "readWrite", db: "facebook" } ] });
// db.createUser({ user: 'jsmith', pwd: 'some-initial-password', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });

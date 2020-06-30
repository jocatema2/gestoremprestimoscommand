const Emprestimo = require('../Model/emprestimo.js');
const UserEvent = require('../Model/userEvent.js')
const Send = require('../MessageBroker/Sender.js');
const Service = require('../Service/emprestimoService.js');
const http = require('request');

// cria e guarda um novo emprestimo
exports.create = (req, res) => {
    // request valido
    if(!req.body.inicio || !req.body.fim || !req.body.nomeUser || !req.body.tituloObra) {
        return res.status(400).send({
            message: "Emprestimo invalido"
        });
    }

    // Create a Emprestimo
    const emprestimo = new Emprestimo({
        inicio: req.body.inicio,
        fim: req.body.fim,
        nomeUser: req.body.nomeUser,
        tituloObra: req.body.tituloObra,
        estado: 'Pendente'
    });

    getUtilizador(emprestimo, function(info) {
        Service.createEmprestimoPendente(emprestimo);
        return res.status(200).send({
            message: emprestimo
        });
});
}

function getUtilizador(emprestimo, callback){
    var nome = emprestimo.nomeUser;
    http('https://gestaousers.herokuapp.com/users/' + nome,function (error, response, body) {
       callback(body, response.statusCode);
   });
}

// Delete a emprestimo with the specified id in the request
exports.delete = (req, res) => {
  const emprestimo = new Emprestimo({
      idEmp: req.params.id, // the id received is the one refering to the query database
      inicio: req.body.inicio,
      fim: req.body.fim,
      nomeUser: req.body.nomeUser,
      tituloObra: req.body.tituloObra,
      estado: 'Fechado'
  });

  Service.closeEmprestimo(emprestimo);

  return res.status(200).send({
      message: emprestimo
  });
};
const Emprestimo = require('../Model/emprestimo.js');
const UserEvent = require('../Model/userEvent.js');
const Send = require('../MessageBroker/Sender.js');

module.exports = {

  createEmprestimoPendente : function(emprestimo) {
      
    emprestimo.save()
    .then(data => {
        var evento = new UserEvent({
          emprestimo: data,
          timestamp: new Date(),
          eventType: 'RequestCreate'
        });
        evento.save()
        .then(data2 => {
            Send.sendFanout(data, "EMPRESTIMO_PENDING"); // to GE_Query
        }).catch(err2 => {
            console.log("1");
            console.log("Erro a guardar evento na DB!");
        });
    }).catch(err => {
        console.log("2");
        console.log("Erro ao guardar emprestimo na DB!");
    });
  },

  createEmprestimoDefinitivo : function(response, estadoRecebido) {

    var emprestimo = new Emprestimo({
        idEmp: response._id,
        inicio: response.inicio,
        fim: response.fim,
        nomeUser: response.nomeUser,
        tituloObra: response.tituloObra,
        estado: estadoRecebido
    });

    if (emprestimo.estado==='Cancelado') eventType = 'Canceled';
    if (estado==='Ativo') eventType = 'Create';
    
    var evento = new UserEvent({
      emprestimo: emprestimo,
      timestamp: new Date(),
      eventType: eventType
    });

    console.log("Event created: " + evento);
    console.log("Emprestimo updated: " + emprestimo);

    // Save Emprestimo in the database
    emprestimo.save()
    .then(data => {
        var evento = new UserEvent({
          emprestimo: data,
          timestamp: new Date(),
          eventType: eventType
        });
        evento.save()
        .then(data2 => {
            Send.sendFanout(data, "EMPRESTIMO_CREATED"); // to GE_Query
        }).catch(err2 => {
            console.log(" Erro a guardar evento na DB! " + err.message);
        });
    }).catch(err => {
        console.log("Erro a guardar emprestimo na DB! " + err.message);
    });
  },

  closeEmprestimo : function(emprestimo) {
    console.log(" Emprestimo para ser fechado: " + JSON.stringify(emprestimo));

    // Save Emprestimo in the database
    emprestimo.save()
    .then(data => {
        var evento = new UserEvent({
          emprestimo: data,
          timestamp: new Date(),
          eventType: 'Close'
        });

        evento.save()
        .then(data2 => {
            console.log("Empréstimo updated: " + JSON.stringify(data));
            Send.sendFanout(emprestimoJSON, "CLOSE_EMPRESTIMO"); // to GE_Query
        }).catch(err2 => {
            console.log("Erro ao guardar evento na DB! " + err.message);
        });
    }).catch(err => {
      console.log("Erro a atualizar o Emprestimo. " + err.message);
    });
  }


}

#!/usr/bin/env node
const Service = require('../Service/emprestimoService.js');
var amqp = require('amqplib/callback_api');

const gestorEmprestimos_queue = "GestorEmprestimosCommand_Queue";

module.exports = {
  executeRabbitReceiver : function() {
    amqp.connect('amqp://srvbwpty:jT30ovrtxQanxJEh2qBNQ-p8mAzex7iy@cat.rmq.cloudamqp.com/srvbwpty', function(error0, connection) {
      if (error0) {
          throw error0;
      }
      connection.createChannel(function(error1, channel) {
          if (error1) {
              throw error1;
          }

          channel.assertQueue(gestorEmprestimos_queue, {
              durable: false
          });

          console.log("hm", gestorEmprestimos_queue);

          channel.consume(gestorEmprestimos_queue, function(msg) {
              var response = JSON.parse(msg.content.toString());
              console.log("A receber evento: " + response.eventType);
              switch(response.eventType) {
                case 'HAS_AUTHORIZATION_EMPRESTIMO':
                  Service.createEmprestimoDefinitivo(response, 'Ativo');
                  break;
                case 'ERROR_AUTHORIZATION_EMPRESTIMO':
                    Service.createEmprestimoDefinitivo(response, 'Cancelado');
                    break;
                default:
                  console.log("**Nenhum tipo de evento encontrado!**");
              }
          }, {
              noAck: true
          });
      });
    });
  }
}
#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const Emprestimo = require('../Model/emprestimo.js');

const gestorEmprestimosQuery_queue = "GestorEmpestimosQuery_Queue";

const exchange = "GestorEmprestimosCommand_exchange";

module.exports = {
  sendFanout : function(emprestimo, eventType) {
    amqp.connect('amqp://localhost', function(error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }

        var msg = JSON.stringify(emprestimo);

        // Acrescenta o eventType ao JSON enviado por mensagem
        msg = msg.substring(0, msg.length-1) + ",\"eventType\":\"" + eventType + "\"}";

        channel.assertExchange(exchange, 'fanout', {
          durable: true
        });

        // binds
        channel.bindQueue(gestorEmprestimosQuery_queue, exchange, '');

        channel.publish(exchange, '', Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
      });

      setTimeout(function() {
        connection.close();
        //process.exit(0);
      }, 500);
    });
  }
}

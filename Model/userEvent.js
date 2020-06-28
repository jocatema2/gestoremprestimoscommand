const mongoose = require('mongoose');
const Emprestimo = require('../Model/emprestimo.js');

const UserEventSchema = mongoose.Schema({
  timestamp: Date,
  eventType: {
      type: String,
      enum : ['Create', 'RequestCreate', 'RequestUpdate', 'Update', 'Close', 'Canceled'],
      default: 'RequestCreate'
    },
  emprestimo: {
      idEmp: String,
      inicio: Date,
      fim: Date,
      nomeUser: String,
      tituloObra: String,
      estado:  {
        type: String,
        enum : ['Ativo','Fechado', 'Pendente', 'Cancelado'],
        default: 'Pendente'
      }
  }
});


module.exports = mongoose.model('UserEvent', UserEventSchema);

const mongoose = require('mongoose');

const EmprestimoSchema= mongoose.Schema({
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
});

module.exports = mongoose.model('Emprestimo', EmprestimoSchema);

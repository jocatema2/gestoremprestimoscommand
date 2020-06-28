module.exports = (app) => {
    const emprestimos = require('../Controller/emprestimoController.js');
  
 // Create a new emprestimo
    app.post('/emprestimos', emprestimos.create);

    // Put a emprestimo by id
    app.put('/emprestimos/:id', emprestimos.delete);
}

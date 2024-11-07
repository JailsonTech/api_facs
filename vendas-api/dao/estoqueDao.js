const db = require("../config/conexao");

class EstoqueDAO {
    adicionar(estoque) {
        const sql = `INSERT INTO estoques (nome, valor, quantidade) VALUES (?, ?, ?)`;
        db.run(sql, [estoque.nome, estoque.valor, estoque.quantidade]);
    }

    get(id, callback) {
        db.get('SELECT * FROM estoques WHERE id = ?', [id], (err, estoque) => {
            if (err || estoque == undefined) {
                callback("not found", null);
            } else {
                callback(null, estoque);
            }
        });
    }

    all(callback) {
        db.all('SELECT * FROM estoques', [], (err, estoques) => {
            if (err || estoques == undefined) {
                callback("not found", null);
            } else {
                callback(null, estoques);
            }
        });
    }

    total(callback) {
        db.get('SELECT count(*) as count FROM estoques', [], (err, total) => {
            if (err || total == undefined) {
                callback("not found", null);
            } else {
                callback(null, total.count);
            }
        });
    }
}

module.exports = new EstoqueDAO();

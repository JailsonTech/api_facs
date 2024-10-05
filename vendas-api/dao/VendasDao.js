const db = require("../config/conexao");

class VendasDAO {
    adicionar(venda) {
        const sql = `INSERT INTO vendas (id_cliente, id_estoque, valor_total, quantidade)
                     VALUES (?, ?, ?, ?)`;
        db.run(sql, [venda.id_cliente, venda.id_estoque, venda.valor_total, venda.quantidade]);
    }

    get(id, callback) {
        db.get('SELECT * FROM vendas WHERE id = ?', [id], (err, venda) => {
            if (err || venda == undefined) {
                callback("not found", null);
            } else {
                callback(null, venda);
            }
        });
    }

    all(callback) {
        db.all('SELECT * FROM vendas', [], (err, vendas) => {
            if (err || vendas == undefined) {
                callback("not found", null);
            } else {
                callback(null, vendas);
            }
        });
    }

    total(callback) {
        db.get('SELECT count(*) as count FROM vendas', [], (err, total) => {
            if (err || total == undefined) {
                callback("not found", null);
            } else {
                callback(null, total.count);
            }
        });
    }
}

module.exports = new VendasDAO();

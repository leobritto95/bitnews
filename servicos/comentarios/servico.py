from flask import Flask, jsonify
import mysql.connector as mysql

servico = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True
TAMANHO_PAGINA = 8

MYSQL_SERVER = "bancodados"
MYSQL_USER = "root"
MYSQL_PASS = "admin"
MYSQL_BANCO = "bitnews"


def get_conexao_bd():
    conexao = mysql.connect(
        host=MYSQL_SERVER, user=MYSQL_USER, password=MYSQL_PASS, database=MYSQL_BANCO)

    return conexao


@servico.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)


def gerar_comentario(registro):
    comentario = {
        "_id": registro["id"],
        "feed": registro["news_id"],
        "user": {
            "account": registro["account"],
            "name": registro["name"],
        },
        "datetime": registro["date_formated"],
        "content": registro["comment"],
    }

    return comentario


@servico.route("/comentarios/<int:news_id>/<int:pagina>")
def get_comentarios(news_id, pagina):
    comentarios = []

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    OFFSET = (pagina - 1) * TAMANHO_PAGINA
    cursor.execute(
        "SELECT *, DATE_FORMAT(date, '%Y-%m-%d %H:%i') date_formated " +
        "FROM comments WHERE news_id = " + str(news_id) +
        " ORDER BY date DESC " +
        f"LIMIT {OFFSET}, {TAMANHO_PAGINA}")
    resultado = cursor.fetchall()
    for registro in resultado:
        comentarios.append(gerar_comentario(registro))

    return jsonify(comentarios)


@servico.route("/adicionar/<int:news_id>/<string:name>/<string:account>/<string:comment>")
def get_adicionar(news_id, name, account, comment):
    resultado = jsonify(situacao="ok", erro="")

    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    try:
        cursor.execute(
            "INSERT INTO comments (news_id, name, account, comment, date) " +
            f"VALUES ({news_id}, '{name}', '{account}', '{comment}', NOW())"
        )
        conexao.commit()
    except:
        conexao.rollback()
        # TODO alem de retornar a mensagem de erro, o erro deve ser guardado em log pelo servico
        resultado = jsonify(
            situacao="erro", erro="erro adicionando comentario")

    return resultado


@servico.route("/remover/<int:id>")
def get_remover(id):
    resultado = jsonify(situacao="ok", erro="")

    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    try:
        cursor.execute(
            f"DELETE FROM comments WHERE id = {id}"
        )
        conexao.commit()
    except:
        conexao.rollback()
        # TODO alem de retornar a mensagem de erro, o erro deve ser guardado em log pelo servico
        resultado = jsonify(situacao="erro", erro="erro removendo comentario")

    return resultado


if __name__ == "__main__":
    servico.run(
        host="0.0.0.0",
        debug=DEBUG
    )

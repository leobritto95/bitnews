from flask import Flask, jsonify
import mysql.connector as mysql

servico = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True

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


@servico.route("/gostou/<string:email>/<int:news_id>")
def usuario_gostou(email, news_id):
    num_likes = 0

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        "SELECT count(*) as num_likes FROM likes " +
        f"WHERE email = '{email}' AND news_id = {news_id}")
    registro = cursor.fetchone()
    if registro:
        num_likes = registro["num_likes"]

    return jsonify(likes=num_likes)


@servico.route("/gostar/<string:email>/<int:news_id>")
def gostar(email, news_id):
    resultado = jsonify(situacao="ok", erro="")

    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    try:
        cursor.execute(
            f"INSERT INTO likes (news_id, email) VALUES ({news_id}, '{email}')"
        )
        conexao.commit()
    except:
        conexao.rollback()
        # TODO alem de retornar a mensagem de erro, o erro deve ser guardado em log pelo servico
        resultado = jsonify(situacao="erro", erro="erro adicionando like")

    return resultado


@servico.route("/desgostar/<string:email>/<int:news_id>")
def desgostar(email, news_id):
    resultado = jsonify(situacao="ok", erro="")

    conexao = get_conexao_bd()
    cursor = conexao.cursor()
    try:
        cursor.execute(
            f"DELETE FROM likes WHERE news_id = {news_id} AND email = '{email}'"
        )
        conexao.commit()
    except:
        conexao.rollback()
        # TODO alem de retornar a mensagem de erro, o erro deve ser guardado em log pelo servico
        resultado = jsonify(situacao="erro", erro="erro removendo like")

    return resultado


if __name__ == "__main__":
    servico.run(
        host="0.0.0.0",
        debug=DEBUG
    )

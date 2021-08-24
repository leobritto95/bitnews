from flask import Flask, jsonify
import mysql.connector as mysql

servico = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True
TAMANHO_PAGINA = 4

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


def gerar_menutags(registro):
    menutags = {
        "_id": registro["id"],
        "tag": registro["tag"],
        "name": registro["name"]
    }

    return menutags


@servico.route("/menutags")
def get_menutags():
    menutags = []

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tags WHERE name IS NOT NULL")
    resultado = cursor.fetchall()
    for registro in resultado:
        menutags.append(gerar_menutags(registro))

    return jsonify(menutags)


if __name__ == "__main__":
    servico.run(
        host="0.0.0.0",
        debug=DEBUG
    )

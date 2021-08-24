from flask import Flask, jsonify, json
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


def gerar_feed(registro):
    feed = {
        "_id": registro["id"],
        "title": registro["title"],
        "content": registro["content"],
        "url": registro["url"],
        "blobs": registro["blobs"],
        "likes": registro["likes"],
        "datetime": registro["date_formated"],
    }

    return feed


def get_total_likes(news_id):
    likes = 0
    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        f"SELECT count(*) as num_likes FROM likes WHERE news_id = {news_id}")
    resultado = cursor.fetchone()
    if resultado:
        likes = resultado["num_likes"]

    return likes


def get_images(news_id):
    images = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        f"SELECT image FROM images WHERE news_id = {news_id}")
    resultado = cursor.fetchall()
    for image in resultado:
        images.append(image)
    return images


@servico.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)


@servico.route("/feeds/<int:pagina>")
def get_feeds(pagina):
    feeds = []

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    OFFSET = (pagina - 1) * TAMANHO_PAGINA
    cursor.execute(
        "SELECT *, DATE_FORMAT(date, '%Y-%m-%d %H:%i') date_formated FROM news " +
        "ORDER BY date desc " +
        f"LIMIT {OFFSET}, {TAMANHO_PAGINA}")

    resultado = cursor.fetchall()
    for registro in resultado:
        registro["blobs"] = get_images(registro["id"])
        registro["likes"] = get_total_likes(registro["id"])
        feeds.append(gerar_feed(registro))

    return jsonify(feeds)


@servico.route("/feed/<int:id>")
def get_feed(id):
    feed = {}

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        "SELECT *, DATE_FORMAT(date, '%Y-%m-%d %H:%i') date_formated FROM news " +
        f"WHERE id = {id}")

    registro = cursor.fetchone()
    if registro:
        registro["blobs"] = get_images(registro["id"])
        registro["likes"] = get_total_likes(registro["id"])
        feed = gerar_feed(registro)

    return jsonify(feed)


@servico.route("/feeds-por-busca/<string:busca>/<int:pagina>")
def get_feeds_por_busca(busca, pagina):
    feeds = []

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    OFFSET = (pagina - 1) * TAMANHO_PAGINA
    cursor.execute(
        "SELECT DISTINCT n.*, DATE_FORMAT(date, '%Y-%m-%d %H:%i') date_formated " +
        "FROM news n " +
        "JOIN tags_news ON news_id = n.id " +
        "JOIN tags t ON t.id = tags_id " +
        f"WHERE title LIKE '%{busca}%' OR t.tag LIKE '%{busca}%'" +
        "ORDER BY date desc " +
        f"LIMIT {OFFSET}, {TAMANHO_PAGINA}")

    resultado = cursor.fetchall()
    for registro in resultado:
        registro["blobs"] = get_images(registro["id"])
        registro["likes"] = get_total_likes(registro["id"])
        feeds.append(gerar_feed(registro))

    return jsonify(feeds)


@servico.route("/feeds-por-tag/<string:tag>/<int:pagina>")
def get_feeds_por_tag(tag, pagina):
    feeds = []

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    OFFSET = (pagina - 1) * TAMANHO_PAGINA
    cursor.execute(
        "SELECT DISTINCT n.*, DATE_FORMAT(date, '%Y-%m-%d %H:%i') date_formated " +
        "FROM news n " +
        "JOIN tags_news ON news_id = n.id " +
        "JOIN tags t ON t.id = tags_id " +
        f"WHERE t.tag = '{tag}'" +
        "ORDER BY date desc " +
        f"LIMIT {OFFSET}, {TAMANHO_PAGINA}")

    resultado = cursor.fetchall()
    for registro in resultado:
        registro["blobs"] = get_images(registro["id"])
        registro["likes"] = get_total_likes(registro["id"])
        feeds.append(gerar_feed(registro))

    return jsonify(feeds)


if __name__ == "__main__":
    servico.run(
        host="0.0.0.0",
        debug=DEBUG
    )

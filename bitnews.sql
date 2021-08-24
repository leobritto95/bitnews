CREATE DATABASE  IF NOT EXISTS `bitnews` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bitnews`;
-- MySQL dump 10.13  Distrib 8.0.26, for Linux (x86_64)
--
-- Host: 172.29.1.5    Database: bitnews
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` varchar(510) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `news_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_feed_idx` (`news_id`),
  CONSTRAINT `comments_FK` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'teste1',4,'Leandro Britto','leleozzynho@gmail.com','2021-08-20 17:51:05'),(2,'teste',2,'Leandro Britto','leleozzynho@gmail.com','2021-08-22 00:56:31');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `news_id` int NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `images_FK` (`news_id`),
  CONSTRAINT `images_FK` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,1,'ps5.webp'),(2,1,'ps5s.jpg'),(3,2,'echo.jpg'),(4,2,'echo2.jpg'),(5,3,'wpp.jpg'),(6,3,'wpp2.jpg'),(7,4,'lgpd1.jpg'),(8,4,'lgpd2.jpg'),(9,5,'wpp3.webp'),(10,5,'wpp2.jpg');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `news_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_likes_feeds_idx` (`news_id`),
  CONSTRAINT `likes_FK` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,1,'leleozzynho@gmail.com'),(2,2,'leleozzynho@gmail.com');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `url` varchar(1020) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'O PlayStation 5 (PS5) ultrapassou a marca de 10 milhões em tempo recorde','O PlayStation 5 (PS5) ultrapassou a marca de 10 milhões de consoles vendidos globalmente no último dia 18 de julho, segundo a Sony, o que torna o console de venda mais rápida na história da empresa. Segundo a companhia, o foco agora será em aumentar o estoque, esgotado em muitas lojas, para que todos possam comprar uma unidade do produto.\n\nLançado em novembro de 2020, o PlayStation 5 superou até mesmo o sucesso do PlayStation 4 (PS4), que levou cerca de um mês a mais atingir o número. O preço do PS5 à venda no varejo nacional é de R$ 4.699 com leitor de discos e de R$ 4.199 na versão que aceita apenas mídia digital.','https://www.techtudo.com.br/noticias/2021/07/ps5-chega-a-10-milhoes-de-unidades-vendidas-em-tempo-recorde.ghtml','2019-11-01 12:00:05'),(2,'Dispositivos Echo da Amazon com descontos de até R$ 200','A Amazon iniciou nesta segunda-feira (02 de agosto) uma nova promoção em seu site, que traz seus dispositivos Echo com descontos de até R$ 200 OFF. Essa pode ser a sua oportunidade de garantir os smart speakers oficiais da empresa por um preço mais em conta, como os Echo Dot de 3ª e 4ª Geração, Echo Studio e os Echo Show.','https://www.tecmundo.com.br/produto/222221-dispositivos-echo-amazon-descontos-r-200-off.htm','2021-08-02 10:09:05'),(3,'WhatsApp permite envio de dinheiro para pessoas a partir de hoje','O WhatsApp ja está permitindo que pessoas transfiram dinheiro para outras pessoas, assim como enviam mensagens, áudios, vídeos ou fotos. Não haverá cobrança de taxas, mas a facilidade por enquanto só está disponível para clientes de duas bandeiras de cartões e de nove empresas financeiras do país.\n\nAssim, o serviço de transferência de valores via WhatsApp vai estar disponível imediatamente para uma pequena fatia dos cerca de 130 milhões de usuários que a plataforma tem no Brasil. Segundo o diretor de operações do WhatsApp, Matt Idema, a nova operação vai começar a ser oferecida a um pequeno grupo de usuários no país para, gradualmente, chegar aos demais.','https://economia.uol.com.br/noticias/redacao/2021/05/04/whatsapp-vai-permitir-envio-de-dinheiro-para-pessoas-a-partir-de-hoje.htm','2021-05-04 17:00:05'),(4,'Descumprir a Lei Geral de Proteção de dados pode gerar punições','A Lei Geral de Proteção de Dados (LGPD), que estabelece regras sobre os uso dos dados pessoais dos brasileiros, está em vigor desde setembro de 2020. Mas só a partir deste domingo (1º) a Autoridade Nacional de Proteção de Dados (ANPD) poderá aplicar sanções a quem descumprir.\n\nEmpresas que desrespeitarem a LGPD podem ser multadas em até R$ 50 milhões por infração, mas documento que define cálculo para esta sanção ainda não foi publicado. Autoridade de proteção de dados deve começar aplicando advertências.','https://g1.globo.com/economia/tecnologia/noticia/2021/08/01/descumprir-a-lei-geral-de-protecao-de-dados-pode-gerar-punicoes-a-partir-deste-domingo.ghtml','2021-03-04 09:10:00'),(5,'WhatsApp ganha opção para enviar fotos e vídeos que só podem ser visualizados uma vez','O WhatsApp oficializou nesta terça-feira (3) um recurso que permite enviar fotos e vídeos que podem ser visualizados apenas uma vez.\nA ideia do WhatsApp é oferecer mais privacidade para quem deseja compartilhar um arquivo sem deixá-lo acessível para sempre aos seus contatos.\n\nAs mensagens com fotos e vídeos de visualização única desaparecem automaticamente depois que o conteúdo é visualizado pelos destinatários. Para o arquivo sumir após ser visualizado, basta tocar sobre o ícone de número \"1\" antes de enviá-lo.','https://g1.globo.com/economia/tecnologia/noticia/2021/08/03/whatsapp-ganha-opcao-para-enviar-fotos-e-videos-que-so-podem-ser-visualizados-uma-vez.ghtml','2021-03-10 15:00:00');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'promo','Promoções'),(2,'privacidades','Privacidade'),(3,'games','Games'),(4,'ps5',NULL),(5,'playstation',NULL),(6,'plays',NULL),(7,'amazon',NULL),(8,'echo',NULL),(9,'descontos',NULL),(10,'promoção',NULL),(11,'promocao',NULL),(12,'promoções',NULL),(13,'whatsapps',NULL),(14,'wpp',NULL),(15,'transferencias',NULL),(16,'dinheiro',NULL),(17,'pix',NULL),(18,'dados',NULL),(19,'lgpd',NULL),(20,'mensagens',NULL);
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags_news`
--

DROP TABLE IF EXISTS `tags_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags_news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tags_id` int NOT NULL,
  `news_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tags_news_FK` (`tags_id`),
  KEY `tags_news_FK_1` (`news_id`),
  CONSTRAINT `tags_news_FK` FOREIGN KEY (`tags_id`) REFERENCES `tags` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tags_news_FK_1` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags_news`
--

LOCK TABLES `tags_news` WRITE;
/*!40000 ALTER TABLE `tags_news` DISABLE KEYS */;
INSERT INTO `tags_news` VALUES (1,4,1),(2,5,1),(3,6,1),(4,7,2),(5,8,2),(6,9,2),(7,10,2),(8,11,2),(9,12,2),(10,13,3),(11,14,3),(12,15,3),(13,16,3),(14,17,3),(15,2,3),(16,18,4),(17,19,4),(18,2,4),(19,13,5),(20,14,5),(21,20,5),(22,2,5),(23,1,2),(24,3,1);
/*!40000 ALTER TABLE `tags_news` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-22  0:18:00

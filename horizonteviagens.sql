-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 29/10/2026 às 11:24
-- Versão do servidor: 9.1.0
-- Versão do PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `horizonteviagens`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `idAdmin` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `senha` varchar(20) NOT NULL,
  `nomeAdmin` varchar(150) NOT NULL,
  PRIMARY KEY (`idAdmin`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `admin`
--

INSERT INTO `admin` (`idAdmin`, `email`, `senha`, `nomeAdmin`) VALUES
(1, 'admin@horizon.com', '123', 'Geral'),
(2, 'arthur@admin.com', '1234', 'Arthur'),
(3, 'fischer@admin.com', '1234', 'Fischer');

-- --------------------------------------------------------

--
-- Estrutura para tabela `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE IF NOT EXISTS `clientes` (
  `nome` varchar(15) NOT NULL,
  `sobrenome` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telefone` varchar(16) NOT NULL,
  `dataNascimento` date NOT NULL,
  `senha` varchar(20) NOT NULL,
  `idCliente` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`idCliente`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `destinos`
--

DROP TABLE IF EXISTS `destinos`;
CREATE TABLE IF NOT EXISTS `destinos` (
  `idDestino` int NOT NULL AUTO_INCREMENT,
  `continente` varchar(10) NOT NULL,
  `pontoTuristico` varchar(50) NOT NULL,
  `valor` int NOT NULL,
  `descricaoLugar` varchar(255) NOT NULL,
  PRIMARY KEY (`idDestino`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `destinos`
--

INSERT INTO `destinos` (`idDestino`, `continente`, `pontoTuristico`, `valor`, `descricaoLugar`) VALUES
(1, 'america', 'CristoRedentor', 2500, 'Rio de Janeiro - Brasil. Um dos principais cartões-postais do país.'),
(2, 'america', 'machuPicchu', 3200, 'Peru. Uma das atrações históricas mais famosas da América do Sul.'),
(3, 'america', 'estatuaDaLiberdade', 4500, 'Nova York - Estados Unidos. Um dos símbolos mais conhecidos do país.'),
(4, 'africa', 'piramidesDeGize', 4200, 'Egito. Um dos maiores símbolos da história da humanidade.'),
(5, 'africa', 'safariNoSerengeti', 5500, 'Tanzânia. Experiência para conhecer a vida selvagem africana.'),
(6, 'africa', 'cataratasVitoria', 4800, 'Uma das maiores quedas d\'água do continente africano.'),
(7, 'europa', 'torreEiffel', 7200, 'Paris - França. Um dos principais símbolos da Europa.'),
(8, 'europa', 'coliseu', 5800, 'Roma - Itália. Um dos maiores monumentos da Roma Antiga.'),
(9, 'europa', 'bigBen', 6200, 'Londres - Inglaterra. Um dos pontos turísticos mais conhecidos da cidade.'),
(10, 'asia', 'tajMahal', 5200, 'Índia. Um dos monumentos mais famosos do mundo.'),
(11, 'asia', 'grandeMuralhaDaChina', 6000, 'China. Uma das maiores construções históricas do mundo'),
(12, 'asia', 'monteFuji', 6500, 'Japão. Uma das paisagens naturais mais famosas do país.'),
(13, 'oceania', 'operaDeSydney', 7500, 'Austrália. Um dos edifícios mais conhecidos do país.'),
(14, 'oceania', 'grandeBarreiraDeCorais', 8000, 'Austrália. Um dos maiores sistemas de recifes do mundo.'),
(15, 'oceania', 'milfordSound', 7800, 'Nova Zelândia. Paisagem natural famosa por seus fiordes.');

-- --------------------------------------------------------

--
-- Estrutura para tabela `viagens`
--

DROP TABLE IF EXISTS `viagens`;
CREATE TABLE IF NOT EXISTS `viagens` (
  `destino` varchar(50) NOT NULL,
  `passageiro` varchar(150) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `email` varchar(50) NOT NULL,
  `dataIda` date NOT NULL,
  `dataRetorno` date NOT NULL,
  `pagamento` varchar(20) NOT NULL,
  `valor` int NOT NULL,
  `dataCompra` date NOT NULL,
  `idCompra` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`idCompra`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: signdb
-- ------------------------------------------------------
-- Server version	8.0.45
DROP DATABASE IF EXISTS `signdb`;
CREATE DATABASE `signdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `signdb`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `zip` varchar(20) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `phone` bigint DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `middleInitial` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('patient','therapist','donor','admin') NOT NULL DEFAULT 'patient',
  `state` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKemail` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=345678405 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `userId` bigint NOT NULL,
  `birthday` date DEFAULT NULL,
  `emergencyContactName` varchar(255) DEFAULT NULL,
  `emergencyContactPhone` bigint DEFAULT NULL,
  PRIMARY KEY (`userId`),
  CONSTRAINT `fk_patient_user`
    FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `therapist`
--

DROP TABLE IF EXISTS `therapist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `therapist` (
  `userId` bigint NOT NULL,
  `specialty` varchar(255) NOT NULL,
  `licenseNumber` varchar(100) NOT NULL,
  `isAvailable` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `UK_therapist_license` (`licenseNumber`),
  CONSTRAINT `fk_therapist_user`
    FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `donor`
--

DROP TABLE IF EXISTS `donor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donor` (
  `userId` bigint NOT NULL,
  `donorType` enum('person','company') NOT NULL DEFAULT 'person',
  `companyName` varchar(255) DEFAULT NULL,
  `taxId` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  CONSTRAINT `fk_donor_user`
    FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `patientId` bigint NOT NULL,
  `therapistId` bigint NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `durationMinutes` int NOT NULL DEFAULT 60,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `activeSlot` tinyint GENERATED ALWAYS AS (IF(`status` <> 'cancelled', 1, NULL)) VIRTUAL,
  PRIMARY KEY (`id`),
  KEY `idx_appointment_patient` (`patientId`),
  KEY `idx_appointment_therapist_date` (`therapistId`, `date`),
  UNIQUE KEY `uk_therapist_active_slot` (`therapistId`, `date`, `time`, `activeSlot`),
  CONSTRAINT `fk_appointment_patient`
    FOREIGN KEY (`patientId`) REFERENCES `patient` (`userId`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_appointment_therapist`
    FOREIGN KEY (`therapistId`) REFERENCES `therapist` (`userId`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `donation`
--

DROP TABLE IF EXISTS `donation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `donorId` bigint NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'EUR',
  `frequency` enum('one_time','monthly','quarterly','annually') NOT NULL DEFAULT 'one_time',
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `paymentMethod` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_donation_donor` (`donorId`),
  CONSTRAINT `fk_donation_donor`
    FOREIGN KEY (`donorId`) REFERENCES `donor` (`userId`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Database Administrator User Setup
--

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'SignAdmin2026!';
GRANT ALL PRIVILEGES ON `signdb`.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;

--
-- Seed data for development & testing
--

INSERT INTO `user` (`zip`, `id`, `phone`, `city`, `email`, `firstName`, `lastName`, `middleInitial`, `password`, `role`, `state`, `street`) VALUES
('28013', 1, 600111222, 'Madrid',    'therapist@gmail.com', 'Laura',  'Gomez',     'M',    'Therapist*1234', 'therapist', 'Madrid',    'Calle Mayor 12'),
('08006', 2, 600333444, 'Barcelona', 'patient@gmail.com',   'Carlos', 'Ruiz',      'A',    'Patient*1234',   'patient',   'Cataluña',  'Av. Diagonal 450'),
('41004', 3, 600555666, 'Sevilla',   'donor@gmail.com',     'Elena',  'Torres',    NULL,   'Donor*1234',     'donor',     'Andalucía', 'Calle Sierpes 8'),
('28013', 4, 600777888, 'Madrid',    'admin@safespace.com', 'Admin',  'SafeSpace', NULL,   'Admin*1234',     'admin',     'Madrid',    'Calle Mayor 12');

INSERT INTO `therapist` (`userId`, `specialty`, `licenseNumber`, `isAvailable`) VALUES
(1, 'Terapia Cognitivo-Conductual', 'COL-M-28491', 1);

INSERT INTO `patient` (`userId`, `birthday`, `emergencyContactName`, `emergencyContactPhone`) VALUES
(2, '1995-06-15', 'Ana Ruiz', 600999888);

INSERT INTO `donor` (`userId`, `donorType`, `companyName`, `taxId`) VALUES
(3, 'person', NULL, '12345678Z');

INSERT INTO `appointment` (`patientId`, `therapistId`, `date`, `time`, `durationMinutes`, `status`) VALUES
(2, 1, '2026-12-10', '10:00:00', 60, 'confirmed');

INSERT INTO `donation` (`donorId`, `amount`, `currency`, `frequency`, `status`, `paymentMethod`) VALUES
(3, 50.00, 'EUR', 'monthly', 'completed', 'card');

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

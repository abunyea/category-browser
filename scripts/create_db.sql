CREATE DATABASE Ontology;
USE Ontology;

CREATE TABLE Categories(
	conceptId      INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	displayName    VARCHAR(255),
  	description    VARCHAR(1024),
  	alternateNames VARCHAR(255),
	FULLTEXT idx (displayName, description, alternateNames)
);

CREATE TABLE Edges(
	parentId INT,
	childId  INT NOT NULL
);

INSERT INTO Categories
	(conceptId, displayName, description, alternateNames)
VALUES 
	(1, "Diagnosis", "Entity domain", null),
    (2, "Disease of Nervous System", "Diseases targeting the nervous system", null),
    (3, "Disease of Eye", "Diseases targeting the eye", null),
    (4, "Physical disorders", "Physical disorders", null),
    (5, "Multiple Sclerosis (MS)", "Multiple Sclerosis", "MS,Multiple cerebral sclerosis,Multiple cerebro-spinal sclerosis");

INSERT INTO Edges
	(parentId, childId)
VALUES
	(NULL, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (2, 5),
    (4, 5);

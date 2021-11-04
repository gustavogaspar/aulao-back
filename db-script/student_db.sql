CREATE USER 'db_user'@'%' IDENTIFIED BY "Oracle@123";
CREATE DATABASE student;
GRANT ALL ON student.* to 'db_user'@'%';
USE student;
CREATE TABLE student (fname VARCHAR(20), lname VARCHAR(20), email VARCHAR(100));
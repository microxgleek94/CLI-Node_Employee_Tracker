DROP DATABASE IF EXISTS employeesDB;
CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department (
    -- use "UNSIGNED"to make sure no negative #s are used 
    -- use "UNIQUE" to make sure columns dont have duplicate info 
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
--   https://www.mysqltutorial.org/mysql-foreign-key/
-- to reference the id column in the department table
-- use "ON DELETE CASCADE" so if a row from the parent table (department) is deleted or updated
-- the values of the matching rows in the child table (role) automatically deleted or updated.
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department
    (name)
VALUES
    ('Graphics'),
    ('Development'),
    ('Testing'),
    ('Public Relations');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Graphic Designer', 100000, 1),
    ('Lead 3D Graphic Designer', 80000, 1),
    ('Lead Fronteend Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Senior Backend Developer', 160000, 2),
    ("Testing Lead", 125000, 3),
    ('HR Assistant', 250000, 4),
    ('HR Lead', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Clayton', 'Greed', 1, NULL),
    ('George', 'Richter', 2, 1),
    ('Harry', 'Potter', 3, NULL),
    ('Jorge', 'Tup', 4, NULL),
    ('Zory', 'Singh', 5, NULL),
    ('Frankie', 'Brown', 6, 5),
    ("Eddy", 'Tuft', 7, NULL),
    ('Todd', 'Eden', 8, 7);
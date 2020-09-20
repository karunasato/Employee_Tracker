drop database employee;
create database employee;
use employee;
create table department(
id int auto_increment primary key,
departmentName varchar (30) not null
);

create table employeeRole(
id int auto_increment primary key,
title varchar(30) not null,
salary decimal not null,
department_id int,
constraint fk_dep_id foreign key (department_id) references department(id) on delete cascade
);

create table employee(
id int auto_increment primary key,
first_name varchar (30) not null,
last_name varchar(30) not null,
role_id int,
manager_id int,
constraint fk_role_id foreign key(role_id) references employeeRole(id) on delete cascade,
constraint fk_manager_id foreign key(manager_id) references employee(id) on delete set null
)
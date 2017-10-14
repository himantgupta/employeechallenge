Delete from employee where employeeid > 0;
alter table employee auto_increment=1;
Insert into employee (firstname, middlename, lastname, dob, doj, status) values ('himant', '', 'Gupta', '1983-2-7', '2005-11-11', 'A');
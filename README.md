# employeechallenge
Modules used: Express, body-parser, basic-auth

How to test: Please use postman or any other plugin for client side to call the services.

Assumptions: 
•	All the data payload is JSON ( application/Json)
•	Client side validations are not there, and I assume that the date format etc, is already valid and coming in input as valid values.
•	The authorization as per requirement is only for delete operation. Other operations are without the authorization.
•	Clear DB has the sequence/increment of 10, so the unique ID of the employee is not incremented by 1 in this implementation, we can choose auto increment by 1 too. But for this implementation it is 10.
Architecture: Node JS on Heroku with Clear DB

Files in the projects
1.	Index.js = the application server file with logic
2.	Package.json – The usual config file for Node applications with dependencies
3.	Initdata.sql – The file to ingest initial data.

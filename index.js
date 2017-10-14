const express = require('express');
const bodyParser = require('body-parser');
var mySql = require('mysql');
var fs = require('fs');

//var sql = fs.readFileSync('init_database.sql').toString();

const app = express();
const port = process.env.PORT || 8000;
const values = [];
//-----------------------------Database variables ----------------------------------------------
var dbHost = process.env.DB_HOST;
var dbUser = process.env.DB_USER;
var dbPassword = process.env.DB_PASS;
var dB = process.env.DB;
var authUser = process.env.AUTH_USER;
var authPass = process.env.AUTH_PASS;
var db_config = {
					host: dbHost,
					user: dbUser,
					password: dbPassword,
					database: dB,
				};

var db_config_initdata = {
							host: dbHost,
							user: dbUser,
							password: dbPassword,
							database: dB,
							multipleStatements: true
						};
var myConnection;

//------------------------------- Server start -------------------------------------------------
app.listen(port, function(err, result) {
   if(err)  {
   	res.send('Error starting server..')
   }
   else {
	   console.log('Server started');
	   // Validate the connection and populate init data
	   myConnection = mySql.createConnection(db_config_initdata)
	   //myConnectionmultipleStatements: true});
	   var sql = fs.readFileSync('./initdata.sql').toString();
	   console.log("initdata is:" + sql);
	   // Execute init data script
	   myConnection.query(sql, function (error, results, fields) {
	   		if (error) throw error;
			  // `results` is an array with one element for every statement in the query:
			console.log("Init data script ran successfully");
			myConnection.destroy();
		});
   }
});


//-------------------------------Default welcome page -------------------------------------------
app.get('/', function(req, res){
   res.status(200).send('I am the default Home page : Welcome');
});


// -----------------------------Get JSON of the req body ----------------------------------------
app.use(bodyParser.json());
var jsonReqData;

// -----------------------------Create new Employee ---------------------------------------------
app.post('/employee/create', function(req, res){

	jsonReqData = req.body;
	var values = [];
	// get all values from JSON and push into table.
	values.push(
				jsonReqData.firstname, 
				jsonReqData.middleName, 
				jsonReqData.lastName, 
				jsonReqData.dateOfBirth, 
				jsonReqData.dateOfEmployment, 
				jsonReqData.empStatus );
	    
	myConnection = mySql.createConnection(db_config);
    console.log ("Initiating connection");
    myConnection.connect(function(err){
   		if (err){
   		console.log("Error in connection" + err);
   		throw err;
   		}
   		else {
	   		console.log("mySql connected");
	   		// Once connection is established fire the query
	   		console.log ("Preparing query");
	   	    var sql = "INSERT INTO EMPLOYEE (firstname, middlename, lastname, dob, doj, status) VALUES ?";	
			myConnection.query(sql, [[values]], function(error, results) {
				if(error){
					console.log(error);
					res.send('Cannot create a new employee');
				}
				else {
	   		        console.log ("Created the employee successfully");
					res.send ("Created the employee successfully with ID:" + results.insertId);
				}
			myConnection.destroy();
			})
   		}
   })
});

//-------------------------------Get employee details with ID.----------------------------------
app.get('/employee/:id', function(req, res){
   console.log("Getting employee details");
   var employeeId = req.params.id;
   myConnection = mySql.createConnection(db_config);
   myConnection.connect(function(err){
   		if (err){
   		console.log("Error in connection" + err);
   		throw err;
   		}
   		else {
	   		//console.log("mySql connected");
	   		// Once connection is established fire the query
	   		var sql = "SELECT * from EMPLOYEE where employeeid=" + employeeId;	
			myConnection.query(sql, function(error, results) {
				if(error){
					console.log(error);
					res.send ("Sorry! I could not get the info due to some errors.");
				}
				else {
	   		        if ( results != null && results.length > 0)
	   		        //console.log ("Created the employee successfully");
						res.send("Employee details are:" + JSON.stringify(results));
					else
						res.send("Could not find info about the employee requested.");
				}
				myConnection.destroy();
			})
   		}
   })
});

// ---------------------------------------Get all employees--------------------------------------
app.get('/employees', function(req, res){
   console.log("Getting all employee details");
   myConnection = mySql.createConnection(db_config);
   myConnection.connect(function(err){
   		if (err){
   		console.log("Error in connection" + err);
   		throw err;
   		}
   		else {
	   		// Once connection is established fire the query
	   		var sql = "SELECT * from EMPLOYEE where status ='A'";	
			myConnection.query(sql, function(error, results) {
				if(error){
					console.log(error);
					res.send ("Sorry! I could not find any data for employees");
				}
				else {
	   		        //console.log ("Created the employee successfully");
					res.send("Employee(s) details are:" + JSON.stringify(results));
				}
				myConnection.destroy();
			})
   		}
   })
});


//----------------------------- Update Employee Details ---------------------------------------------
app.post('/employee/update/:id', function(req, res){

	jsonReqData = req.body;
	var employeeId = req.params.id;
	var values = [];
	// get all values from JSON and push into table.
	values.push(
				jsonReqData.firstname, 
				jsonReqData.middleName, 
				jsonReqData.lastName, 
				jsonReqData.dateOfBirth, 
				jsonReqData.dateOfEmployment, 
				jsonReqData.empStatus );
	    
	myConnection = mySql.createConnection(db_config);
    console.log ("Initiating connection");
    myConnection.connect(function(err){
   		if (err){
   		console.log("Error in connection" + err);
   		throw err;
   		}
   		else {
	   		console.log("mySql connected");
	   		// Once connection is established fire the query
	   		console.log ("Preparing query");
	   	    var sql = "Update EMPLOYEE set firstname = ?, middlename = ?, lastname = ?, dob = ?, doj = ?, status = ? where employeeId=" + employeeId ;	
			myConnection.query(sql, [values[0],values[1], values[2], values[3], values[4], values[5]], function(error, results) {
				if(error){
					console.log(error);
					res.send('Cannot update employee data.');
				}
				else {
	   		        console.log ("Updated successfully");
					res.send ("Updated Employee Data for employee ID :" + employeeId);
				}
			myConnection.destroy();
			})
   		}
   })
});

//----------------------------- Delete employee/deactivate ------------------------------------------
app.delete('/employee/delete/:id', function(req, res){
   console.log("Getting employee details");
   var employeeId = req.params.id;
   // Validate header and if valid update the status
   var auth = require('basic-auth')
   var credentials = auth(req)

  if (!credentials || credentials.name !== authUser || credentials.pass !== authPass) {
    res.statusCode = 401
    res.end('Access denied')
  } else {
       myConnection = mySql.createConnection(db_config);
   	   myConnection.connect(function(err){
   	   if (err){
   		console.log("Error in connection" + err);
   		throw err;
   		}
   		else {
	   			var sql = "Update EMPLOYEE set status ='I' where employeeid=" + employeeId;	
				myConnection.query(sql, function(error, results) {
				if(error){
					console.log(error);
					res.send ("Sorry! I could not get the info due to some errors.");
				}
				else {
	   		        	res.send("Updated rows :" + results.changedRows);
				}
				myConnection.destroy();
			})
   		}
   })
  }
});

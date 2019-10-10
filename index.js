//END POINTS
/*
 POST:'localhost3000/employees'  =  Inserts new employee into your data.
 GET: 'localhost3000/employees' = Returns json with information from all employees.
 GET: 'localhost3000/employees/<employeeID>'  =  Returns json with the information from that specific employee.
 PUT: 'localhost3000/employees/<employeeID>'  =  Updates information for specified employee.
 DELETE: 'localhost3000/employees/<employeeID>'  =  Removes the employee with that ID from the data.
*/

/* Here I am importing express into my application by using the require() function and putting it in a variable 
called 'express' so I'll be able to use it throughout my code. On the next line of code, I am making a new variable
called app, which contains the express() function.  */
const express = require('express')
const app = express()

/* I am importing Joi by using the require() and putting it in a variable called 'Joi'. Joi is a node package that will
help me validate the client's requests when they send them to the server.*/
const Joi = require('joi')

/* Here I am importing my JSON file into my code to make it accessible for me to use throughout the code by using the require() 
function. I am applying it to a variable called data. */
const data = require('./employees.json')

/*I am using app.use to be able to manipulate my JSON file that I imported into the application. This parses incoming JSON requests.*/
app.use(express.json())


/* Right here, I am using .get() function to perform an http get request. I'm passing in two arguments into .get(), the pathway of my
file (endpoint) and a callback function. In the callback function, I am passing in two arguments, req and res. In the function, I am
doing res.send and this will send back the message that is inside of the argument to the client's interface. */
app.get('/', (req, res) => {
    res.send('Change the route path to see what happens!')
})


/* I'm using the same functionality as in the .get() function above to perform a http get request, its just that the differences in
this get request is that the pathway is to my employees json file. In this get request, I'll be sending my json file to the client's
interface. */
app.get('/employees', (req, res) => {
    res.send(data)
})


/* Here, I am also using the same functionality as the .get() functions above to perform a http get request, the only differene in
this get request is that I am making the pathway more dynamic if the client puts an ID number at the end of the path to view a specific
employee record from the json.*/
app.get('/employees/:id', (req, res) => {
    /* Here I am making a variable called employee and then taking the JSON file and applying the .find() function to find a specific
    employee that has the same ID number as the ID in the parameters of my route path.*/
    const employee = data.find(e => e.employeeID === parseInt(req.params.id))
    /* If the client enters in a number that is not assigned to an employee in my JSON file in the parameter, then it will trigger this
    conditional if statement. It will set the status of the response as a 404 and display an error message. */
    if (!employee) return res.status(404).send(`${res.statusCode}: Employee was not found!`);
    res.send(employee)
})


/* This is the function that is validating the user's response. Joi is uses a schema to help check and validate the user's response,
so I am creating a schema to check over my responses. */
validateEmployee = (employee) => {
    /* Joi checks the datatype of each specified key pair value that I specified in the schema. Then it checks if the field needs to be
    a over a certain amount of characters and if the value is required. The reason I didn't add the employee's ID in the schema is 
    because, I do not want the client to change their id number as it auto-increments and corelates to their position on the JSON file 
    I imported. */
    const schema = {
        fName: Joi.string().min(2).required(),
        lName: Joi.string().min(2).required(),
        salery: Joi.number().integer().required(),
        department: Joi.string().required()
    }
    /* I am returning the function along side with the validation function that is used in Joi. This will check the req.body that will
    be passed in as an argument, and will use the schema to validate the client's input. I am applying another option after I added the
    schema and the reasoning for this is to apply some default settings that Joi has. abortEarly is a setting that is 'True' by default
    in Joi and what this means is that once an error appears, it stops everything and takes that one error. It completely leaves the
    rest of the other errors out of the array it has that contains errors.*/
    return Joi.validate(employee, schema, { abortEarly: false })
}



/* I am using a .post() function to perform a HTTP POST request for the client to create a resource and send it to the server.*/
app.post('/employees', (req, res) => {
    /* I am creating a variable called error to contain the validateEmployee() function. */
    const { error } = validateEmployee(req.body)
    /* I am now applying an if conditional statement to check if there is an error, and if it does print out the array of errors that
    it finds. Then it will have an http status of 404.*/
    if (error) {
        const arr = error.details;
        const errArray = arr.map(err => ({
            msg: err.message,
            statusCode: `${res.statusCode}`
        }))
        res.status(400).send(errArray);
        return;
    } else {
        /* If there are no error messages, then I'm setting the status to 201.*/
        res.status(201)
    }

    /* Here I am creating a new variable called 'newEmployee' to hold the resource that client wants to create and send to the server.*/
    const newEmployee = {
        "employeeID": data.length + 1,
        "fName": req.body.fName,
        "lName": req.body.lName,
        "salery": req.body.salery,
        "department": req.body.department
    }
    /* I'm taking the newEmployee and pushing it to my array of employeees.*/
    data.push(newEmployee);
    /* I am sending the client back the new resouce that they created.*/
    res.send(newEmployee)
})

// Here I am using the .put() function to perform a HTTP PUT request to the server.
app.put('/employees/:id', (req, res) => {
    /* Here I am making a variable called employee and then taking the JSON file and applying the .find() function to find a specific
    employee that has the same ID number as the ID in the parameters of my route path.*/
    const employee = data.find(e => e.employeeID === parseInt(req.params.id))
    /* If the client enters in a number that is not assigned to an employee in my JSON file in the parameter, then it will trigger this
    conditional if statement. It will set the status of the response as a 404 and display an error message. */
    if (!employee) return res.status(404).send(`${res.statusCode} Employee was not found!`);

    /* I am creating a variable called error to contain the validateEmployee() function. */
    const { error } = validateEmployee(req.body)
    /* I am now applying an if conditional statement to check if there is an error, and if it does print out the array of errors that
    it finds. Then it will have an http status of 404.*/
    if (error) {
        const arr = error.details;
        const errArray = arr.map(err => ({
            msg: err.message,
            statusCode: `${res.statusCode}`
        }))
        res.status(400).send(errArray);
        return;
    } else {
        /* If there are no error messages, then I'm setting the status to 200.*/
        res.status(200)
    }

    /* Here I am setting the new resource that the client wants to update to an older resouce.*/
    employee.fName = req.body.fName;
    employee.lName = req.body.lName;
    employee.salery = req.body.salery;
    employee.department = req.body.department;

    /* Here I am sending the new updated employee that the client updated.*/
    res.send(employee)

})


// Here I am using the .delete() function to perform an HTTP DELETE request.
app.delete('/employees/:id', (req, res) => {
    /* Here I am making a variable called employee and then taking the JSON file and applying the .find() function to find a specific
    employee that has the same ID number as the ID in the parameters of my route path.*/
    const employee = data.find(e => e.employeeID === parseInt(req.params.id))
    /* If the client enters in a number that is not assigned to an employee in my JSON file in the parameter, then it will trigger this
    conditional if statement. It will set the status of the response as a 404 and display an error message. */
    if (!employee) return res.status(404).send(`${res.statusCode} Employee was not found!`);

    /* I am making a variable called 'index' to take the indexOf the 'employee' variable I made above. This will be looking at the poition of the
    employee that I am going to delete.*/
    const index = data.indexOf(employee);
    /* This will be where I delete the employee.*/
    data.splice(index, 1);
    /*I am sending the employee that got deleted.*/
    res.send(employee)
})


// Here I'm just putting the server on an enviornment and if the server does not reach the enviornment, it will go onto port 3000.
const port = process.env.PORT || 3003
app.listen(port, console.log(`listening on port ${port}...`))


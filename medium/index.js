// END POINTS
/*
 GET: 'localhost3000/employees' = Json with information from all 10 employees.
 GET: 'localhost3000/employees/<employeeID>' = Json with the information from that specific employee.
*/

/* Here I am importing express into my application by using the require() function and putting it in a variable 
called 'express' so I'll be able to use it throughout my code. On the next line of code, I am making a new variable
called app, which contains the express() function.  */
const express = require('express')
const app = express()

/* Here I am importing my JSON file into my code to make it accessible for me to use throughout the code by using the require() 
function. I am applying it to a variable called data. */
const data = require('./employees.json')

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
    if (!employee) return res.status(404).send(`${res.statusCode} Employee was not found!`);
    res.send(employee)
})

// Here I'm just putting the server on an enviornment and if the server does not reach the enviornment, it will go onto port 3000.
const port = process.env.PORT || 3000
app.listen(port, console.log(`listening on port ${port}...`))


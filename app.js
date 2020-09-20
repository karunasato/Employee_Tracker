require("dotenv").config();
const {prompt} = require("inquirer");
const db = require('./connection.js');

const queries = {
    viewAll(tablename){
        db.query(`SELECT * FROM ${tablename}`, function(err, data){
            console.table(data);
            setTimeout(main, 2000)
        })
    },
    addOne(tablename, obj){
        db.query(`INSERT INTO ${tablename} SET ?`, obj , function(err,data){
            if(err){
                console.log("Invalid data entry!")
            }else{
                console.log(`${tablename} successfully added!`);
            }
            setTimeout(main, 2000)
        })
    }
}

const prompts = {
    main: {
        message: "What would you like to do?",
        type: "list",
        choices: ["View All Employees", "View All Roles", "View All Departments", "Add New Employee", 
        "Add New Role", "Add New Department", "Nothing, I'm done"],
        name: "choice"
    },
    addEmp: [
        {
            message: "What is their first name?",
            name: "first_name"
        },
        {
            message: "What is their last name?",
            name: "last_name"
        },
        {
            message: "What is their role id?",
            name: "role_id"
        },
        {
            message: "What is their manager's id?",
            name: "manager_id"
        }
    ],
    addRole: [
        {
            message: "What is the employee's title?",
            name: "title"
        },
        {
            message: "What is their salary",
            name: "salary"
        },
        {
            message:"What is their department ID?",
            name: "department_id"
        }
    ],
    addDept:[
        {
            message: "What is the department name?",
            name: "departmentName"
        }
    ]
}

function main(){
    prompt(prompts.main)
    .then(({choice})=> {
        if(choice === "View All Employees"){
            queries.viewAll("employee")
        }
        if(choice === "View All Roles"){
            queries.viewAll("employeeRole")
        }
        if(choice === "View All Departments"){
            queries.viewAll("department")
        }
        if(choice === "Add New Employee"){
            prompt(prompts.addEmp)
            .then(emp => queries.addOne("employee", emp))
        }
        if(choice === "Add New Role"){
            prompt(prompts.addRole)
            .then(emp => queries.addOne("employeeRole", emp))
        }
        if(choice === "Add New Department"){
            prompt(prompts.addDept)
            .then(emp => queries.addOne("department", emp))
        }

        //more if statements for other db methods


        if(choice === "Nothing, I'm done"){
            db.end()
        }
        //return to main menu

    })
}


main()
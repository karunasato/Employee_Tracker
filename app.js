require("dotenv").config();
const { prompt } = require("inquirer");
const db = require('./connection.js');

const queries = {
    viewAll(tablename) {
        return db.query(`SELECT * FROM ${tablename}`);
    },
    addOne(tablename, obj) {
        return db.query(`INSERT INTO ${tablename} SET ?`, obj);
    },
    updateRole(eid, rid) {
        return db.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: rid }, { id: eid }])
    },
    updateManager(eid, mid) {
        return db.query(`UPDATE employee SET ? WHERE ?`, [{ manager_id: mid }, {id: eid}])
    },
    deleteRole(obj) {
        return db.query(`DELETE FROM employeeRole WHERE ?`, obj)
    },
    deleteEmployee(obj) {
        return db.query(`DELETE FROM employee WHERE ?`, obj)
    },
    deleteDepartment(obj) {
        return db.query(`DELETE FROM department WHERE ?`, obj)
    }
}

const prompts = {
    main: {
        message: "What would you like to do?",
        type: "list",
        choices: ["View All Employees", "View All Roles", "View All Departments", "Add New Employee",
            "Add New Role", "Add New Department", "Update Employee Role", "Update Manager", "Delete Employee Role", "Delete Employee", "Delete Department", "Nothing, I'm done"],
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
            message: "What is their salary?",
            name: "salary"
        },
        {
            message: "What is their department ID?",
            name: "department_id"
        }
    ],
    addDept: [
        {
            message: "What is the department name?",
            name: "departmentName"
        }
    ]
}

function main() {
    prompt(prompts.main)
        .then(({ choice }) => {
            if (choice === "View All Employees") {
                queries.viewAll("employee")
                    .then(data => {
                        console.table(data)
                        setTimeout(main, 2000)
                    })
            }
            if (choice === "View All Roles") {
                queries.viewAll("employeeRole")
                    .then(data => {
                        console.table(data)
                        setTimeout(main, 2000)
                    })
            }
            if (choice === "View All Departments") {
                queries.viewAll("department")
                    .then(data => {
                        console.table(data)
                        setTimeout(main, 2000)
                    })
            }
            if (choice === "Add New Employee") {
                prompt(prompts.addEmp)
                    .then(emp => queries.addOne("employee", emp)
                        .then(data => {
                            console.log("Successfully added employee!")
                            setTimeout(main, 2000)
                        }
                        ))
            }
            if (choice === "Add New Role") {
                prompt(prompts.addRole)
                    .then(emp => queries.addOne("employeeRole", emp)
                        .then(data => {
                            console.log("Successfully added role!")
                            setTimeout(main, 2000)
                        }
                        ))
            }
            if (choice === "Add New Department") {
                prompt(prompts.addDept)
                    .then(emp => queries.addOne("department", emp)
                        .then(data => {
                            console.log("Successfully added department!")
                            setTimeout(main, 2000)
                        }
                        ))
            }
            if (choice === "Update Employee Role") {
                queries.viewAll("employee")
                    .then(employees => {
                        prompt({
                            message: "Which employee would you like to update?",
                            type: "list",
                            name: "emp",
                            choices: employees.map(a => ({ name: `${a.first_name} ${a.last_name}`, value: a.id }))
                        })
                            .then(({ emp }) => {
                                queries.viewAll("employeeRole")
                                    .then(roles => {
                                        prompt(
                                            {
                                                message: "What is their new role?",
                                                type: "list",
                                                name: "role",
                                                choices: roles.map(a => ({ name: `${a.title}`, value: a.id }))
                                            }
                                        ).then(({ role }) => {
                                            queries.updateRole(emp, role)
                                                .then(data => {
                                                    console.log("Successfully updated employee role!");
                                                    setTimeout(main, 2000)
                                                })
                                        })
                                    })
                            })
                    })
            }
            if (choice === "Delete Employee Role") {
                queries.viewAll("employeeRole")
                    .then(roles => {
                        prompt(
                            {
                                message: "What role would you like to remove?",
                                type: "list",
                                name: "role",
                                choices: roles.map(a => ({ name: `${a.title}`, value: a.id }))
                            }
                        ).then(({ role }) => {
                            queries.deleteRole({ id: role })
                                .then(data => {
                                    console.log("Successfully deleted role!");
                                    setTimeout(main, 2000)
                                })
                        })
                    })

            }
            if (choice === "Delete Employee") {
                queries.viewAll("employee")
                    .then(roles => {
                        prompt(
                            {
                                message: "What employee would you like to remove?",
                                type: "list",
                                name: "employee",
                                choices: roles.map(a => ({ name: `${a.first_name} ${a.last_name}`, value: a.id }))
                            }
                        ).then(({ employee }) => {
                            queries.deleteEmployee({ id: employee })
                                .then(data => {
                                    console.log("Successfully deleted employee!");
                                    setTimeout(main, 2000)
                                })
                        })
                    })
            }
            if (choice === "Delete Department") {
                queries.viewAll("department")
                    .then(roles => {
                        prompt(
                            {
                                message: "What department would you like to remove?",
                                type: "list",
                                name: "department",
                                choices: roles.map(a => ({ name: `${a.departmentName}`, value: a.id }))
                            }
                        ).then(({ department }) => {
                            queries.deleteDepartment({ id: department })
                                .then(data => {
                                    console.log("Successfully deleted Department!");
                                    setTimeout(main, 2000)
                                })
                        })
                    })
            }

            if (choice === "Update Manager") {
                queries.viewAll("employee")
                    .then(employees => {
                        prompt({
                            message: "Which employee would you like to update?",
                            type: "list",
                            name: "emp",
                            choices: employees.map(a => ({ name: `${a.first_name} ${a.last_name}`, value: a }))
                        })
                            .then(({ emp }) => {
                                const newManagerChoices = employees.filter(a => a.id != emp.id && a.id != emp.manager_id)
                                    .map(a => ({ name: `${a.first_name} ${a.last_name}`, value: a.id }));
                                prompt(
                                    {
                                        message: "What is their new manager?",
                                        type: "list",
                                        name: "man_id",
                                        choices: newManagerChoices
                                    }
                                ).then(({ man_id }) => {
                                    queries.updateManager(emp.id, man_id)
                                    .then(data => {
                                        console.log("Successfully updated manager!");
                                        setTimeout(main, 2000)
                                    })
                                })
                            })
                    })
            }


            //more if statements for other db methods


            if (choice === "Nothing, I'm done") {
                db.end()
            }
            //return to main menu

        })
}


main()
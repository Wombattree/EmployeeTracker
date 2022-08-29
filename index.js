const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection
(
    {
        host: 'localhost',
        user: 'root',
        password: 'bootcamp',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

function Init()
{
    PickFromMainOptions();
}

function PickFromMainOptions()
{
    inquirer.prompt([
    {
        type: 'list',
        message: `What would you like to do?`,
        choices: ["View all departments", "View all roles", "View all employees", new inquirer.Separator(), 
                  "Add a department", "Add a role", "Add an employee", new inquirer.Separator(), 
                  "Update an employee role"],
        name: 'optionChosen',
    }]).then((response) =>
    {
        switch (response.optionChosen)
        {
            case "View all departments": DisplayAllDepartments(); break;
            case "View all roles": DisplayAllRoles(); break;
            case "View all employees": DisplayAllEmployees(); break;
            case "Add a department": AddADepartment(); break;
            case "Add a role": AddARole(); break;
            case "Add an employee": AddAnEmployee(); break;
            case "Update an employee role": UpdateAnEmployeeRole(); break;
            default: console.Log("Option not found"); break;
        }
    });
}

// function GetAllDepartmentNames()
// {
//     db.query(`SELECT * FROM department`, (error, result) => 
//     {
//         if (error) { console.log("Error"); return; }
//         const names = [];
//         for (let i = 0; i < result.length; i++) names.push(result[i].name);
//         return names;
//     });
// }

// GetAllDepartmentNames();

function DisplayAllDepartments()
{
    db.query(`SELECT * FROM department`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        console.log("\n---------------------");
        console.table(result);
        PickFromMainOptions();
    });
}

function DisplayAllRoles()
{
    db.query(`SELECT * FROM role`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        console.log("\n---------------------");
        console.table(result);
        PickFromMainOptions();
    });
}

function DisplayAllEmployees()
{
    db.query(`SELECT * FROM employee`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        console.log("\n---------------------");
        console.table(result);
        PickFromMainOptions();
    });
}

function AddADepartment()
{
    inquirer.prompt([
    {
        type: 'input',
        message: `What is the name of the department?`,
        name: 'name',
    },
    {
        type: 'number',
        message: `What is the department ID?`,
        name: 'id',
    }
    ]).then((response) =>
    {
        const sql = `INSERT INTO department (id, name) VALUES ("${response.id}", "${response.name}")`;
        db.query(sql, (error, result) => 
        {
            if (error) { console.log("Error"); return; }
            console.log(`${response.name} added to the list of departments`);
            PickFromMainOptions();
        });
    });
}

function AddARole()
{
    const departmentNames = [];
    db.query(`SELECT * FROM department`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        for (let i = 0; i < result.length; i++) departmentNames.push(result[i].name);
    });

    inquirer.prompt([
    {
        type: 'input',
        message: `What is the title of the role?`,
        name: 'title',
    },
    {
        type: 'number',
        message: `What is the role salary?`,
        name: 'salary',
    },
    {
        type: 'number',
        message: `What is the role ID?`,
        name: 'id',
    },
    {
        type: 'list',
        message: `What department is this role in?`,
        choices: departmentNames,
        name: 'department',
    }
    ]).then((response) =>
    {
        const departmentIDSQL = `SELECT id FROM department WHERE name = "${response.department}"`
        db.query(departmentIDSQL, (error, result) => 
        {
            if (error) { console.log("Error finding department ID"); return; }
            const sql = `INSERT INTO role (id, title, salary, department_id) VALUES ("${response.id}", "${response.title}", "${response.salary}", "${result[0].id}")`;
            db.query(sql, (error, result) => 
            {
                if (error) { console.log("Error adding new role"); return; }
                console.log(`${response.title} added to the list of roles`);
                PickFromMainOptions();
            });
        });
    });
}

function AddAnEmployee()
{
    const roleNames = [];
    db.query(`SELECT * FROM role`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        for (let i = 0; i < result.length; i++) roleNames.push(result[i].title);
    });

    const employeeNames = [];
    employeeNames.push("NA");
    db.query(`SELECT * FROM employee`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        for (let i = 0; i < result.length; i++) employeeNames.push(`${result[i].first_name} ${result[i].last_name}`);
    });

    inquirer.prompt([
    {
        type: 'input',
        message: `What is the employee's first name?`,
        name: 'firstName',
    },
    {
        type: 'input',
        message: `What is the employee's last name?`,
        name: 'lastName',
    },
    {
        type: 'number',
        message: `What is the employee's ID?`,
        name: 'id',
    },
    {
        type: 'list',
        message: `What is this employee's role?`,
        choices: roleNames,
        name: 'role',
    },
    {
        type: 'list',
        message: `What is the name of the employee's manager?`,
        choices: employeeNames,
        name: 'manager',
    }
    ]).then((response) =>
    {
        const roleIDSQL = `SELECT id FROM role WHERE title = "${response.role}"`
        db.query(roleIDSQL, (error, roleResult) => 
        {
            if (error) { console.log("Error finding role ID"); return; }

            const managerNameSplit = response.manager.split(" ");
            const managerIDSQL = `SELECT id FROM employee WHERE first_name = "${managerNameSplit[0]}" AND last_name = "${managerNameSplit[1]}"`
            db.query(managerIDSQL, (error, managerResult) => 
            {
                if (error) { console.log("Error finding manager ID"); return; }
                
                const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("${response.id}", "${response.firstName}", "${response.lastName}", "${roleResult[0].id}", "${managerResult[0].id}")`;
                db.query(sql, (error, result) => 
                {
                    if (error) { console.log("Error adding new employee"); return; }
                    console.log(`${response.firstName} ${response.lastName} added to the list of employees`);
                    PickFromMainOptions();
                });
            });
        });
    });
}

function UpdateAnEmployeeRole()
{
    const roleNames = [];
    db.query(`SELECT * FROM role`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        for (let i = 0; i < result.length; i++) roleNames.push(result[i].title);
    });

    const employeeNames = [];
    employeeNames.push("NA");
    db.query(`SELECT * FROM employee`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        for (let i = 0; i < result.length; i++) employeeNames.push(`${result[i].first_name} ${result[i].last_name}`);
    });

    inquirer.prompt([
    { 
        type: 'list',
        message: `Which employee's role would you like to update?`,
        choices: employeeNames,
        name: 'name',
    },
    {
        type: 'list',
        message: `What role would you like to give the employee?`,
        choices: roleNames,
        name: 'role',
    }
    ]).then((response) =>
    {
        const employeeIDSQL = `SELECT id FROM employee WHERE name = "${response.name}"`
        db.query(employeeIDSQL, (error, nameResult) => 
        {
            if (error) { console.log("Error finding name ID"); return; }

            const roleIDSQL = `SELECT id FROM role WHERE title = "role"`
            db.query(roleIDSQL, (error, roleResult) => 
            {
                if (error) { console.log("Error finding manager ID"); return; }
                
                const sql = `UPDATE employee SET role_id = ${roleResult[0].id} WHERE id = ${nameResult[0].id}`;
                db.query(sql, (error, result) => 
                {
                    if (error) { console.log("Error adding new employee"); return; }
                    console.log(`${response.firstName} ${response.lastName}'s details were updated`);
                    PickFromMainOptions();
                });
            });
        });
    });
}

// // BONUS: Update review name
// app.put('/api/review/:id', (req, res) => {
//   const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
//   const params = [req.body.review, req.params.id];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//     } else if (!result.affectedRows) {
//       res.json({
//         message: 'Movie not found'
//       });
//     } else {
//       res.json({
//         message: 'success',
//         data: req.body,
//         changes: result.affectedRows
//       });
//     }
//   });
// });

app.use((req, res) => { res.status(404).end(); });
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`);});

Init();
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
                  "Update an employee role", new inquirer.Separator()],
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

function DisplayAllDepartments()
{
    db.query(`SELECT * FROM department`, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        console.log("\n------------------------------------------");
        console.table(result);
        PickFromMainOptions();
    });
}

function DisplayAllRoles()
{
    const sql = `SELECT role.id AS ID, role.title AS Title, role.salary AS Salary, department.name AS Department FROM role 
                LEFT JOIN department ON department.id = role.department_id`;
    db.query(sql, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        console.log("\n------------------------------------------");
        console.table(result);
        PickFromMainOptions();
    });
}

function DisplayAllEmployees()
{
    const sql = `SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, department.name AS Department, role.title AS Title, role.salary AS Salary, employee.manager_id AS Manager_ID FROM employee 
    JOIN role ON role.id = employee.role_id JOIN department ON role.department_id = department.id`;
    db.query(sql, (error, result) => 
    {
        if (error) { console.log("Error"); return; }
        console.log("\n------------------------------------------");
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


function GetAllDepartmentNames()
{
    return new Promise((resolve, reject) =>
    {
        db.query(`SELECT * FROM department`,  (error, result) =>
        {
            if(error) return reject(error);
            const departmentNames = [];
            for (let i = 0; i < result.length; i++) departmentNames.push(`${result[i].name}`);
            return resolve(departmentNames);
        });
    });
}

function GetAllEmployeeNames()
{
    return new Promise((resolve, reject) =>
    {
        db.query(`SELECT first_name, last_name FROM employee`,  (error, result) =>
        {
            if(error) return reject(error);
            const employeeNames = [];
            for (let i = 0; i < result.length; i++) employeeNames.push(`${result[i].first_name} ${result[i].last_name}`);
            return resolve(employeeNames);
        });
    });
}

function GetAllRoleNames()
{
    return new Promise((resolve, reject) =>
    {
        db.query(`SELECT title FROM role`,  (error, result) =>
        {
            if(error) return reject(error);
            const roleNames = [];
            for (let i = 0; i < result.length; i++) roleNames.push(`${result[i].title}`);
            return resolve(roleNames);
        });
    });
}

async function AddARole()
{
    const departmentNames = await GetAllDepartmentNames();

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

async function AddAnEmployee()
{
    const employeeNames = await GetAllEmployeeNames();
    const roleNames = await GetAllRoleNames();

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

async function UpdateAnEmployeeRole()
{
    const employeeNames = await GetAllEmployeeNames();
    const roleNames = await GetAllRoleNames();

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
        const employeeNameSplit = response.name.split(" ");
        const employeeIDSQL = `SELECT id FROM employee WHERE first_name = "${employeeNameSplit[0]}" AND last_name = "${employeeNameSplit[1]}"`;
        db.query(employeeIDSQL, (error, nameResult) => 
        {
            if (error) { console.log("Error finding name ID"); return; }

            const roleIDSQL = `SELECT id FROM role WHERE title = "${response.role}"`;
            db.query(roleIDSQL, (error, roleResult) => 
            {
                if (error) { console.log("Error finding manager ID"); return; }
                
                const sql = `UPDATE employee SET role_id = ${roleResult[0].id} WHERE id = ${nameResult[0].id}`;
                db.query(sql, (error, result) => 
                {
                    if (error) { console.log("Error adding new employee"); return; }
                    console.log(`${response.name}'s details were updated`);
                    PickFromMainOptions();
                });
            });
        });
    });
}

app.use((req, res) => { res.status(404).end(); });
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`);});

Init();
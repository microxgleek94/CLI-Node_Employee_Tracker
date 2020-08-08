// Dependencies
const { prompt } = require("inquirer");
const cTable = require('console.table'); // to display tables nicely in CLI/Terminal
const logo = require("asciiart-logo");
const path = require("path")
const connection = require("./database/config/connection.js");
const dataQuery = require(path.resolve(__dirname, "./database/employee.js"));



//connect to mysql dbase
connection.connect(function (err) {
    if (err) throw err;
    console.log(`server connected to MySQL successfully`)
    start();
});

// Display logo text, load main prompts for user
function start() {
    const logoText = logo({ name: "CLI Employee Tracker" }).render();

    console.log(logoText);

    loadUserPrompts();
}

async function loadUserPrompts() {
    const { choice } = await prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do today?",
            choices: [
                {
                    name: "View All Employees",
                    value: "View all employess"
                },
                {
                    name: "View All Employees By Department",
                    value: "View all employess by department"
                },
                {
                    name: "Add an Employee",
                    value: "add an employee"
                },
                {
                    name: "Remove an Employee",
                    value: "remove an employee"
                },
                {
                    name: "Update an Employee's Role",
                    value: "update an employee's role"
                },
                {
                    name: "View All Roles",
                    value: "view all roles"
                },
                {
                    name: "Add a Role",
                    value: "add a role"
                },
                {
                    name: "Remove a Role",
                    value: "remove a role"
                },
                {
                    name: "View All Departments",
                    value: "view all departments"
                },
                {
                    name: "Add a Department",
                    value: "add a department"
                },
                {
                    name: "Remove a Department",
                    value: "remove a department"
                },
                {
                    name: "Quit the application?",
                    value: "Quit"
                }
            ]
        }
    ]);

    // will call the correct function based on the user's choice
    switch (choice) {
        case "View all employess":
            return viewEmployees();
        case "View all employess by department":
            return viewEmployeesByDepartment();
        case "add an employee":
            return addEmployee();
        case "remove an employee":
            return removeEmployee();
        case "update an employee's role":
            return updateEmployeeRole();
        case "view all departments":
            return viewDepartments();
        case "add a department":
            return addDepartment();
        case "remove a department":
            return removeDepartment();
        case "view all roles":
            return viewRoles();
        case "add a role":
            return addRole();
        case "remove a role":
            return removeRole();
        default:
            return quit();
    }
}

// all async functions will wait till the user makes a choice, then once the information from is received by MySQL,
// or has been collected/entered by the user the results will be returned the user
async function viewEmployees() {
    const employees = await dataQuery.findAllEmployees();
    console.log("\n")
    console.log("Below are all the current employees in the database");
    console.log("-------------------------------------------------------\n");
    console.table(employees)
    loadUserPrompts();
}

async function viewEmployeesByDepartment() {
    const departments = await dataQuery.findAllDepartments();
    // filters through the department query to get 
    // appropriate dept. name and id to display to the user
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to see employees for?",
            choices: departmentChoices
        }
    ]);

    const employees = await dataQuery.findAllEmployeesByDepartment(departmentId);
    console.log("\n")
    console.log(`Below are the employees for your requested department:`);
    console.log("-------------------------------------------------------\n");
    console.table(employees);

    loadUserPrompts();
}

async function removeEmployee() {
    const employees = await dataQuery.findAllEmployees();

    // filters through the employee table and displays the results to user
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to remove?",
            choices: employeeChoices
        }
    ]);

    await dataQuery.removeEmployee(employeeId);
    console.log("\n")
    console.log("Removed employee from the database");
    console.log("-------------------------------------------------------\n");

    loadUserPrompts();
}

async function updateEmployeeRole() {
    const employees = await dataQuery.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        }
    ]);

    const roles = await dataQuery.findAllRoles();

    // gets a list of all the current roles in the database
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    // displays that list to the user
    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "Which role do you want to assign to the selected employee?",
            choices: roleChoices
        }
    ]);

    await dataQuery.updateEmployeeRole(employeeId, roleId);

    console.log("Updated employee's role");

    loadUserPrompts();
}

async function viewRoles() {
    const roles = await dataQuery.findAllRoles();

    console.log("\n");
    console.table(roles);
    console.log("-------------------------------------------------------\n");

    loadUserPrompts();
}

async function addRole() {
    const departments = await dataQuery.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const role = await prompt([
        {
            name: "title",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
        }
    ]);

    // calls the createRole function in employee.js, using the information the user entered from inquirer
    await dataQuery.createRole(role);
    console.log("\n")
    console.log(`Added ${role.title} to the database`);
    console.log("-------------------------------------------------------\n");

    loadUserPrompts();
}

async function removeRole() {
    const roles = await dataQuery.findAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message:
                // because we have the "ON DELETE CASCADE" as a part of our "employee" table for role.id, 
                // and deletions of a role will waterfall and also delete the associated employee
                "Which role do you want to remove? (Warning: This will also delete employees with this role)",
            choices: roleChoices
        }
    ]);

    await dataQuery.removeRole(roleId);

    console.log("Removed role from the database");

    loadUserPrompts();
}

async function viewDepartments() {
    const departments = await dataQuery.findAllDepartments();

    console.log("\n");
    console.log(`Below are the curent departments:`);
    console.log("-------------------------------------------------------\n");
    console.table(departments);

    loadUserPrompts();
}

async function addDepartment() {
    const department = await prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ]);

    // does not show new departments added, but departments are in mysql workbench
    await dataQuery.createDepartment(department);
    // tried to add a new department using unshift but still getting errors
    // department.unshift({ name: "name", value: "department_id"});
    console.log("\n");
    console.log(`Added ${department.name} to the database`);
    console.log("-------------------------------------------------------\n");

    loadUserPrompts();
}

async function removeDepartment() {
    const departments = await dataQuery.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt({
        type: "list",
        name: "departmentId",
        message:
            // because we have the "ON DELETE CASCADE" as a part of our "role" table for department.id, 
            // and deletions of a role will waterfall and also delete the associated employee and roles of that department
            "Which department would you like to remove? (Warning: This will also delete associated roles and employees of this department)",
        choices: departmentChoices
    });

    await dataQuery.removeDepartment(departmentId);

    console.log(`Removed department from the database`);

    loadUserPrompts();
}

async function addEmployee() {
    // to display all the avalible roles and employees currently in the database
    const roles = await dataQuery.findAllRoles();
    const employees = await dataQuery.findAllEmployees();

    const employee = await prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ]);

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
    });

    employee.role_id = roleId;

    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    // The unshift() method adds new items to the beginning of an array, and returns the new length.
    managerChoices.unshift({ name: "None", value: null });

    const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: managerChoices
    });

    employee.manager_id = managerId;

    await dataQuery.createEmployee(employee);

    console.log(
        `Added ${employee.first_name} ${employee.last_name} to the database`
    );

    loadUserPrompts();
}

function quit() {
    console.log("Thanks for using the CLI Node Employee Tracker! See you next time.");
    process.exit();
}








// Dependencies
const { prompt } = require("inquirer");
const cTable = require('console.table'); // to display tables nicely in CLI/Terminal
const logo = require("asciiart-logo");
const path = require("path")
const connection = require("./database/config/connection.js");
const dataQuery = require(path.resolve(__dirname, "./database/employee.js" ));



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
        message: "What would you like to do?",
        choices: [
          {
            name: "View All Employees",
            value: "VIEW_EMPLOYEES"
          },
          {
            name: "View All Employees By Department",
            value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
          },
          {
            name: "Add an Employee",
            value: "ADD_EMPLOYEE"
          },
          {
            name: "Remove an Employee",
            value: "REMOVE_EMPLOYEE"
          },
          {
            name: "Update an Employee's Role",
            value: "UPDATE_EMPLOYEE_ROLE"
          },
          {
            name: "Update an Employee's Manager",
            value: "UPDATE_EMPLOYEE_MANAGER"
          },
          {
            name: "View All Employee Roles",
            value: "VIEW_ROLES"
          },
          {
            name: "Add a Role to an Employee",
            value: "ADD_ROLE"
          },
          {
            name: "Remove a Role from an Employee",
            value: "REMOVE_ROLE"
          },
          {
            name: "View All Departments",
            value: "VIEW_DEPARTMENTS"
          },
          {
            name: "Add a Department",
            value: "ADD_DEPARTMENT"
          },
          {
            name: "Remove a Department",
            value: "REMOVE_DEPARTMENT"
          },
          {
            name: "Quit the application?",
            value: "QUIT"
          }
        ]
      }
    ]);

  // will call the correct function based on the user's choice
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    // case "UPDATE_EMPLOYEE_ROLE":
    //   return updateEmployeeRole();
    case "VIEW_DEPARTMENTS":
      return viewDepartments();
    // case "ADD_DEPARTMENT":
    //   return addDepartment();
    // case "REMOVE_DEPARTMENT":
    //   return removeDepartment();
    // case "VIEW_ROLES":
    //   return viewRoles();
    case "ADD_ROLE":
      return addRole();
    // case "REMOVE_ROLE":
    //   return removeRole();
    default:
      return quit();
  }
}

// all async functions will wait till the user makes a choice, then once the information from is received by MySQL,
// or has been collected/entered by the user the results will be returned the user
async function viewEmployees() {
  const employees = await dataQuery.findAllEmployees();
  console.log("\n")
  console.log("You are now looking at all the current employees");
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

// async function updateEmployeeRole() {
//   const employees = await dataQuery.findAllEmployees();

//   const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
//     name: `${first_name} ${last_name}`,
//     value: id
//   }));

//   const { employeeId } = await prompt([
//     {
//       type: "list",
//       name: "employeeId",
//       message: "Which employee's role do you want to update?",
//       choices: employeeChoices
//     }
//   ]);

//   const roles = await dataQuery.findAllRoles();

//   const roleChoices = roles.map(({ id, title }) => ({
//     name: title,
//     value: id
//   }));

//   const { roleId } = await prompt([
//     {
//       type: "list",
//       name: "roleId",
//       message: "Which role do you want to assign the selected employee?",
//       choices: roleChoices
//     }
//   ]);

//   await dataQuery.updateEmployeeRole(employeeId, roleId);

//   console.log("Updated employee's role");

//   loadUserPrompts();
// }

// async function viewRoles() {
//   const roles = await dataQuery.findAllRoles();

//   console.log("\n");
//   console.table(roles);

//   loadUserPrompts();
// }

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

  await dataQuery.createRole(role);

  console.log(`Added ${role.title} to the database`);

  loadUserPrompts();
}

// async function removeRole() {
//   const roles = await dataQuery.findAllRoles();

//   const roleChoices = roles.map(({ id, title }) => ({
//     name: title,
//     value: id
//   }));

//   const { roleId } = await prompt([
//     {
//       type: "list",
//       name: "roleId",
//       message:
//         "Which role do you want to remove? (Warning: This will also remove employees)",
//       choices: roleChoices
//     }
//   ]);

//   await dataQuery.removeRole(roleId);

//   console.log("Removed role from the database");

//   loadUserPrompts();
// }

async function viewDepartments() {
  const departments = await dataQuery.findAllDepartments();

  console.log("\n");
  console.log(`Below are the curent departments:`);
  console.log("-------------------------------------------------------\n");
  console.table(departments);

  loadUserPrompts();
}

// async function addDepartment() {
//   const department = await prompt([
//     {
//       name: "name",
//       message: "What is the name of the department?"
//     }
//   ]);

//   await dataQuery.createDepartment(department);

//   console.log(`Added ${department.name} to the database`);

//   loadUserPrompts();
// }

// async function removeDepartment() {
//   const departments = await dataQuery.findAllDepartments();

//   const departmentChoices = departments.map(({ id, name }) => ({
//     name: name,
//     value: id
//   }));

//   const { departmentId } = await prompt({
//     type: "list",
//     name: "departmentId",
//     message:
//       "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
//     choices: departmentChoices
//   });

//   await dataQuery.removeDepartment(departmentId);

//   console.log(`Removed department from the database`);

//   loadUserPrompts();
// }

// async function addEmployee() {
//   const roles = await dataQuery.findAllRoles();
//   const employees = await dataQuery.findAllEmployees();

//   const employee = await prompt([
//     {
//       name: "first_name",
//       message: "What is the employee's first name?"
//     },
//     {
//       name: "last_name",
//       message: "What is the employee's last name?"
//     }
//   ]);

//   const roleChoices = roles.map(({ id, title }) => ({
//     name: title,
//     value: id
//   }));

//   const { roleId } = await prompt({
//     type: "list",
//     name: "roleId",
//     message: "What is the employee's role?",
//     choices: roleChoices
//   });

//   employee.role_id = roleId;

//   const managerChoices = employees.map(({ id, first_name, last_name }) => ({
//     name: `${first_name} ${last_name}`,
//     value: id
//   }));
//   managerChoices.unshift({ name: "None", value: null });

//   const { managerId } = await prompt({
//     type: "list",
//     name: "managerId",
//     message: "Who is the employee's manager?",
//     choices: managerChoices
//   });

//   employee.manager_id = managerId;

//   await dataQuery.createEmployee(employee);

//   console.log(
//     `Added ${employee.first_name} ${employee.last_name} to the database`
//   );

//   loadUserPrompts();
// }

function quit() {
  console.log("Thanks for using the CLI Node Employee Tracker! See you next time.");
  process.exit();
}








const connection = require("./config/connection"); // to recieve connection info to MySQL

class dataQuery {
    // Keeping a reference to the connection on the class in case we need it later
    constructor(connection) {
        this.connection = connection;
    }

    // Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
    findAllEmployees() {
        return connection.query(
            // using the forigen keys established and based off the id's inserted into each table
            // the final table printed will show all the data from the "employee" and "role" tables, along w/ manger names and the employee's role and corresponding departments
            // "department.name AS department" is a MySQL alias for the "department" column name (https://www.mysqltutorial.org/mysql-alias/)
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        )
    }

    // Create a new employee
    createEmployee(employee) {
        return this.connection.query("INSERT INTO employee SET ?", employee);
    }

    //Removes an employee by id
    removeEmployee(employeeId) {
        return this.connection.query(
            "DELETE FROM employee WHERE id = ?",
            employeeId
        );
    }

    //Update the selected employee's role
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [roleId, employeeId]
        );
    }

    // Find all roles, join with departments to display the department name
    findAllRoles() {
        return this.connection.query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    }

    // Create a new role
    createRole(role) {
        return this.connection.query("INSERT INTO role SET ?", role);
    }

    // Remove a role fromt the datbase
      removeRole(roleId) {
        return this.connection.query("DELETE FROM role WHERE id = ?", roleId);
      }

    // Find all departments
    // "GROUP BY department.id" is used to group all simliar data by the dept id
    findAllDepartments() {
        return this.connection.query(
            // does not show new departments that have been created
            "SELECT department.id, department.name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
        );
    }

    // Create a new department
      createDepartment(department, err) {
          if (err) {
              throw err
          }
          else return this.connection.query("INSERT INTO department SET ?", department);
      }

    // Remove a department by its id
      removeDepartment(departmentId) {
        return this.connection.query(
          "DELETE FROM department WHERE id = ?",
          departmentId
        );
      }

    // Find all employees in a given department, join with roles to display role titles
    // using the forigen keys established in the schema, will attach roles with their corresponding departments
    findAllEmployeesByDepartment(departmentId) {
        return this.connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
            departmentId
        );
    }
}

// this is so we can export our functions to be interacted with by the user, 
// while also being connected to the MySQL Server
module.exports = new dataQuery(connection);

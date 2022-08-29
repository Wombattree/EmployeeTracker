INSERT INTO department (id, name)
VALUES  (0, "HR"),
        (1, "IT"),
        (2, "Accounting"),
        (3, "Customer Support");

INSERT INTO role (id, title, salary, department_id)
VALUES  (10, "HR Manager", 120000, 0),
        (11, "HR Senior Employee", 100000, 0),
        (12, "HR Employee", 70000, 0),
        (13, "HR Intern", 30000, 0),
        
        (20, "IT Manager", 150000, 1),
        (21, "Senior Software Engineer", 120000, 1),
        (22, "Software Engineer", 100000, 1),
        (23, "Software Intern", 40000, 1),

        (30, "Accounting Manager", 130000, 2),
        (31, "Senior Accountant", 100000, 2),
        (32, "Accountant", 80000, 2),
        (33, "Accounting Intern", 40000, 2),

        (40, "Customer Support Manager", 110000, 3),
        (41, "Senior Customer Support", 80000, 3),
        (42, "Customer Support", 60000, 3),
        (43, "Customer Support Intern", 30000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (10, "Steven", "Philips", 10, null),
        (111, "Frank", "Jacobs", 11, 10),
        (121, "Phil", "Stevenson", 12, 10),
        (122, "Tim", "Waters", 12, 10),
        
        (20, "Lisa", "Peters", 20, null),
        (211, "Frank", "Frankenson", 21, 20),
        (221, "Tom", "Thompson", 22, 20),
        (222, "Peter", "Peterson", 22, 20),
        (223, "Sally", "Sallyson", 22, 20),
        (224, "Greg", "Gregson", 22, 20),
        (225, "Walter", "Walterson", 23, 20),

        (30, "Tyler", "Tylerson", 30, null),
        (311, "Louisa", "Jacobs", 31, 30),
        (321, "Gretta", "Johanson", 32, 30),

        (40, "Yvonne", "Yvonneson", 40, null),
        (411, "Paul", "Paulington", 41, 40),
        (421, "Louis", "Beastars", 42, 40),
        (422, "Pauline", "Franklin", 42, 40);
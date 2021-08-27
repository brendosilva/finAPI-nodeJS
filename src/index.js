const express = require("express");
const { v4: uuid4 } = require("uuid")
const app = express();
const porta = 3333;
const customers = [];

app.use(express.json());



app.post("/account", (request, response) => {
    const { name, cpf } = request.body;
    const custormerAlreadyExists = customers.some((customer) => customer.cpf == cpf);

    if (custormerAlreadyExists) {
        return response.status(400).json({ error: "Customer Already Exists" });
    }

    customers.push({
        cpf,
        name,
        id: uuid4(),
        statement: []
    });

    return response.status(201).send("ok");
});

app.get("/statement/:cpf", (request, response) => {
    const { cpf } = request.params;
    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).send({ error: "Customer not found" });
    }

    return response.json(customer.statement);
});

app.get("/account", (request, response) => {

    for (let i = 0; i <= customers.length; i++) {
        return response.json(customers[i]);
    }

});

app.listen(porta, () => {
    console.log("Server is running!!!");
});
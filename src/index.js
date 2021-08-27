const { response } = require("express");
const express = require("express");
const { v4: uuid4 } = require("uuid")
const app = express();
const porta = 3333;
const customers = [];

app.use(express.json());

function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).send({ error: "Customer not found" });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }

    }, 0);

    return balance;
}


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

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;
    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;
    const balance = getBalance(customer.statement);
    if (balance < amount) {
        return response.status(400).json({ error: 'Insufficient funds' })
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debito',
    };

    customer.statement.push(statementOperation);
    return response.status(201).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});
app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const { date } = request.query;
    const dateFormate = new Date();
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
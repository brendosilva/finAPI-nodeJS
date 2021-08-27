const express = require("express");
const { v4: uuid4 } = require("uuid")
const app = express();
const porta = 3333;
const customers = [];

app.use(express.json());



app.post("/account", (request, response) => {
    const { name, cpf } = request.body;

    const id = uuid4();

    customers.push({
        cpf,
        name,
        id,
        statement: []
    });

    return response.status(201).send("ok");
});

app.get("/account", (request, response) => {

    for (let i = 0; i <= customers.length; i++) {
        return response.json(customers[i]);
    }
})

app.listen(porta, () => {
    console.log("Server is running!!!");
});
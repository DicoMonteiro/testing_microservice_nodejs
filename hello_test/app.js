// // console.log("Olá, Node.js")
// // Estrutura usando o ES5
// const express = require("express");
// const app = express();


// app.get("/", function (req, res) {
//     res.send("Teste sem objeto JSON")
// })

// app.get("/hello", function (req, res) {
//     // res.send("Olá, Nodejs com express.")
//     // Transformando um simples send, em um objeto do tipo json
//     res.status(200).json({message: "Olá, Nodejs com express."})
// })


// app.listen(4000);


// Estrutura usando o ES6 com o auxilio do framework Babel
import express from "express";
const app = express();


app.get("/",  (req, res) => {
    res.send("Teste sem objeto JSON")
})

app.get("/hello",  (req, res) => {
    // res.send("Olá, Nodejs com express.")
    // Transformando um simples send, em um objeto do tipo json
    res.status(200).json({message: "Olá, Nodejs com express."})
})


app.listen(4000);

// Exportando a aplicação para ser consumida em outro local do projeto.
module.exports = app;
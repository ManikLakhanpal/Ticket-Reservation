const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html')); 
});

app.get('/form.html',(req,res)=>{
    res.sendFile(path.join(__dirname, 'form.html'));
})

app.post('/submit-booking',(req,res)=>{

    const newData = req.body;

    fs.readFile("Data.json","utf-8",(err,data)=>{

        let jsonData = [];

        if(!err && data){
            jsonData = JSON.parse(data);
        }

        jsonData.push(newData);

        fs.writeFile("Data.json", JSON.stringify(jsonData,null,2),(err)=>{
            if(err){
                res.status(500);
                res.send("error while submiting form");
            }
            res.status(200);
            res.send("Form submitted successfully");

        })
    })
})

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const db = new pg.Client({
   user: 'postgres',
   host: 'localhost',
   database: 'fetch',
   password: "shin2005-89",
   port: 5432,
});

db.connect();

let results = "";

db.query("SELECT * FROM student", (err, res) => {
    if (!err) {
        results = JSON.stringify(res.rows);
    } else {
        console.log("Error querying database:", err);
    }
});

app.get("/", (req, res) => {
    res.render("index.ejs", { data: results });
});

app.post("/submit", (req, res) => {
    const { student_id, student_name, student_regno } = req.body;
    db.query("INSERT INTO student (student_id, student_name, student_regno) VALUES ($1, $2, $3)", [student_id, student_name, student_regno], (err, result) => {
        if (!err) {
            console.log("Data inserted successfully");
            res.redirect("/");
        } else {
            console.log("Error inserting data into the database:", err);
            res.status(500).send("Error inserting data into the database");
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on the port http://localhost:${port}`);
});

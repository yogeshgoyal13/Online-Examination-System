const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

// To use static css files on server
app.use(express.static(__dirname + '/public'));

// To use body-parser to access form data
app.use(bodyParser.urlencoded({ extended: true }));

// To use ejs
app.set('view engine', 'ejs');

// mongoose connection, database -> examsecureDB
mongoose.connect('mongodb://localhost/examsecureDB', {useNewUrlParser: true, useUnifiedTopology: true});

// all database schemas here
// studentSchema
const studentSchema = new mongoose.Schema({
    name: String,
    rollNo: String,
    branch: String,
    email: String,
    password: String
});

const Student = mongoose.model("Student", studentSchema); 

// adminSchema
const adminSchema = new mongoose.Schema({
    name: String,
    branch: String,
    adminId: String,
    email: String,
    password: String
});

const Admin = mongoose.model("Admin", adminSchema);

// examSchema
const examSchema = new mongoose.Schema({
    examId: String,
    adminId: String,
    description: String,
    branch: String,
    dateAndTime : Date,
    questions: []
});

const Exam = mongoose.model("Exam", examSchema); 

// Home route
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/HTML/index.html");
});

// login route
app.get("/login", (req, res)=>{
    res.sendFile(__dirname + "/HTML/login.html");
});

// signup for student
app.get("/signup", (req, res)=>{
    res.sendFile(__dirname + "/HTML/signup.html");
});

// request admin access for faculty
app.get("/requestadminaccess", (req, res)=>{
    res.sendFile(__dirname + "/HTML/adminAccess.html");
});

// student login form submission
app.post("/studentlogin", (req, res)=>{
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    Student.findOne({email: loginEmail}, (err, currStudent)=>{
        if(err){
            console.log(err);
        }else{
            if(currStudent){
                if(currStudent.password === loginPassword){
                    res.render("studentDashboard", {user: currStudent});
                }else{
                    console.log("Password incorrect");
                }
            }else{
                console.log("currStudent is having null value");
            }
        }
    });
});

// admin login form submission
app.post("/adminlogin", (req, res)=>{
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    Admin.findOne({email: loginEmail}, (err, currAdmin)=>{
        if(err){
            console.log(err);
        }else{
            if(currAdmin){
                if(currAdmin.password === loginPassword){
                    res.render("adminPortal", {user: currAdmin});
                }else{
                    console.log("Password incorrect");
                }
            }else{
                console.log("currAdmin is having null value");
            }
        }
    });
});

// student signup form submission
app.post("/signup", (req, res)=>{
    const newStudent = new Student({
        name: req.body.name,
        rollNo: req.body.rollNo,
        branch: req.body.branch,
        email: req.body.email,
        password: req.body.password
    });

    newStudent.save();
    res.redirect("login");
});

// admin requested access - form submission
app.post("/requestadminaccess", (req, res)=>{
    const newAdmin = new Admin({
        name: req.body.name,
        adminId: req.body.adminId,
        branch: req.body.branch,
        email: req.body.email,
        password: req.body.password
    });

    newAdmin.save();
    res.redirect("/login");
});

// create new exam button clicked => form submission 
app.post("/createExam", (req, res)=>{
    Admin.findOne({adminId: req.body.submitButton}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(!user){
                console.log("User is having null value");
            }else{
                res.render("createExam", {user: user});
            }
        }
    });
});

// admin created exam paper and submitted the create new exam form => handled here
app.post("/handleExamQuestions", (req, res)=>{
    const questionPaper = [];
    
    let questionNumber = 1;
    let numberOfQuestions =  (Object.keys(req.body).length - 5)/6;

    while(numberOfQuestions>0){
        let questionId = req.body['question' + questionNumber];
        let option1Id = req.body['question' + questionNumber + '_option1'];
        let option2Id = req.body['question' + questionNumber + '_option2'];
        let option3Id = req.body['question' + questionNumber + '_option3'];
        let option4Id = req.body['question' + questionNumber + '_option4'];
        let correctAnswerId = req.body['question' + questionNumber + '_ca'];

        let newQuestion = {
            question: questionId,
            optionA: option1Id,
            optionB: option2Id,
            optionC: option3Id,
            optionD: option4Id,
            correctOption: correctAnswerId
        };

        questionPaper.push(newQuestion);

        questionNumber++;
        numberOfQuestions--;
    }

    const newExam = new Exam({
        examId: req.body.examId,
        adminId: req.body.adminId,
        description: req.body.description,
        branch: req.body.branch,
        dateAndTime: req.body.dateAndTime,
        questions: questionPaper
    });

    newExam.save();
    res.send("Databse mei exam saved");
});

// Setup server
app.listen(3000, (req, res)=>{
    console.log("Server started at port 3000");
});
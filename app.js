const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { countReset } = require('console');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());
mongoose.connect("mongodb://localhost:27017/studentDB", {useNewUrlParser: true, useUnifiedTopology: true});

const studentSchema = {
    name: String,
    contact: String,
    subjects: [String],
    class: String,
    societies: [String],
    year: String
}
const Student = mongoose.model("Student", studentSchema);

app.get("/",function(req, res){
    res.redirect("/add");
});

app.route("/add")

.get(function(req, res){
    Student.find(function(err, foundStudents){
        if(!err){
            res.render("home",{Students: foundStudents});
        }
        else{
            //res.send(err);
            res.render("404");
        }
    })
})

.post(function(req, res){
    const newStudent = new Student({
        name: req.body.name,
        contact: req.body.contact,
        class: req.body.class,
        year: req.body.year
    })
    newStudent.save(function(err){
        if(!err){
            //res.send("Successfully added New Student");
            res.redirect("/add");
        }else{
            //res.send(err);
            res.render("404");
        }
    })
})

.delete(function(req, res){
    id = req.body.id;
    Student.findByIdAndDelete(
        id,
        function(err){
            if(!err){
                //res.send("Student id is removed");
                res.redirect("/add");
            }else{
                //res.send(err);
                res.redirect("/404");
            }
        })
});

app.route("/addSubject/:id")

.post(function(req, res){
    console.log(req.body.subject);
    console.log(req.params.id);
    Student.updateOne(
        {_id: req.params.id},
        {$push: {subjects: req.body.subject}},
        function(err){
            if(!err){
                //res.send("Subject Added");
                res.redirect("/Student/"+req.params.id);
            }else{
                //res.send(err);
                res.redirect("/404");
            }
        }
    )
});

app.route("/addSociety/:id")

.post(function(req, res){
    console.log(req.body.society);
    console.log(req.params.id);
    Student.updateOne(
        {_id: req.params.id},
        {$push: {societies: req.body.society}},
        function(err){
            if(!err){
                //res.send("Society Added");
                res.redirect("/Student/"+req.params.id);
            }else{
                //res.send(err);
                res.redirect("/404");
            }
        }
    )
});

app.route("/Student/:id")

.get(function(req, res){
    Student.findOne(
        {_id : req.params.id},
        function(err, foundStudent){
            if(!err){
                //res.send(foundStudent);
                res.render("detail",{Student: foundStudent});
            }else{
                //res.send(err);
                res.redirect("/404");
            }
        }
    )
})

app.get("/404",function(req, res){
    res.render('404');
})

app.listen(3000, function(){
    console.log("Server Running");
})
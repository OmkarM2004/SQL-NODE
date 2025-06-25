const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express  = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'Samartha123@',
  });

  let getRandomUser  = ()  => {
    return [
       faker.string.uuid(),
       faker.internet.username(), // before version 9.1.0, use userName()
       faker.internet.email(),
       faker.internet.password(),
    ];
  }

// Home Page
  app.get("/",(rep,res)=>{
    let q = `SELECT count(*) AS TOTAL FROM USER`;

    try{
            connection.query(q,(err,result)=>{
                if(err) throw err;
                let count = result[0].TOTAL;
                res.render("home.ejs",{count});
             
              })
          }
          catch(err){
            res.send("error occurr in database");
          }
        
   
  })

// Show Page

app.get("/user",(req,res)=>{
    let q = `SELECT * FROM user`;
    try{
        connection.query(q,(err,users)=>{
            if(err) throw err;
            res.render("showusers.ejs",{users});
         
          })
      }
      catch(err){
        res.send("error occurr in database");
      }
})

//update route
app.patch("/user/:id",(req,res)=>{
    let {id} = req.params;
    let{password:formPass , username:newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            if(formPass!=user.PASSWORD){
                res.send("wrong password");
            }
                else{
                    let q2 = `UPDATE user SET USERNAME = '${newUsername}' WHERE id = '${id}'`;
                    connection.query(q2,(err,result) =>{
                        if (err) throw err;
                        res.redirect("/user");
                    })
                }
         
          })
      }
      catch(err){
        res.send("error occurr in database");
      }
})

// edit route
app.get("/user/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            res.render("edit.ejs",{user});
         
          })
      }
      catch(err){
        res.send("error occurr in database");
      }

    
})


app.listen("8080",()=>{
    console.log("server is listing to port 8080");
  })

  // for the send data in bulk in database we used faker for that 


//   let data  = [];
  //  for(let i = 0;i<=100;i++){
  //     data.push(getRandomUser());
  //  }
  
  
  //   let q = "INSERT INTO user(id,username,email,password) VALUES ?";
    
  
  //   try{
  //     connection.query(q,[data],(err,result)=>{
  //         if(err) throw err;
  //         console.log(result);
       
  //       })
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  
  //   connection.end();


  
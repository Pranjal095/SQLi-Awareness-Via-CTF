const express=require('express');
const app=express();
const { Client }=require('pg');
const bodyParser=require('body-parser');

const PORT=3000 || process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }));

const flag="myCTF{wh0_1s_7h3_adm1n_n0w}"

const client=new Client({
  user: 'spidey',
  host: 'localhost',
  database: 'appdb',
  password: 'SPIDEY',
  port: 5432
})

client.connect(err=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("Connected to PostgreSQL database successfully");
  }
})

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/views/LoginPage.html");
})

app.post("/",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;

  const query={
    text: `SELECT * FROM users WHERE username=$1 AND password=$2`,
    values: [username,password] 
  };

  client.query(query,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      if(result.rows.length>0){
        if(result.rows[0].username==="admin"){
          res.send(`Welcome, admin!\nHere is the flag: ${flag}`)
        }
        else{
          res.send(`Welcome, ${result.rows[0].username}!\nUnfortunately, only the user with name admin can access the flag.`)
        }
      }
      else{
        res.send("Invalid credentials.");
      }
    }
  })
})

app.post("/new",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;

  const query1=`SELECT * FROM users WHERE username='${username}'`;

  client.query(query1,async(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      if(result.rows.length>0){
        res.send("User with entered username already exists. Kindly try again with a different one.");
      }
      else{
        const query2={
          text: `INSERT INTO users (username, password, privilege) VALUES ($1, $2, 'USER')`,
          values: [username,password]
        };

        client.query(query2,async(err,result)=>{
          if(err){
            console.log(err);
          }
          else{
            res.send("User successfully created.");
          }
        })
      }
    }
  })
})

app.listen(PORT,()=>{
  console.log("Server is running on PORT ", PORT);
})
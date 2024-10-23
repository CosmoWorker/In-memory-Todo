const express= require("express")
const app=express()
const jwt=require("jsonwebtoken")
const cors = require('cors');
const path=require('path')
require("dotenv").config();
const jwtSecret=process.env.JWT_SECRET;

app.use(express.json())
const port=process.env.PORT || 5000;

users=[]
userTodos=[]
let todoId=0;

JWT_SECRET=jwtSecret;

app.use(cors());

app.use(express.static(path.join(__dirname, '../FE')));

// Serve login.html on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../FE/login_info/index.html'));
});

//Auth 
const auth=(req, res, next)=>{
    const token=req.headers.authorization;
    try{
        if (token){
            const decoded=jwt.verify(token, JWT_SECRET)
            req.username=decoded.username;
            next()
        }
    }catch(err){
        res.status(401).json({
            msg : err
        })
    }
}

app.post("/signup", (req, res)=>{
    const username=req.body.username;
    const password=req.body.password;
    users.push({
        username: username,
        password: password
    })
    userTodos.push({
        username: username,
        todos: []
    })
    res.json({
        msg: "You are Signed Up"
    })
})

app.post("/signin", (req, res)=>{
    const username= req.body.username;
    const password= req.body.password;
    const user=users.find(user=>user.username===username && user.password===password);
    if (user){
        const token=jwt.sign({
            username: user.username
        }, JWT_SECRET)
        res.json({
            msg: "You are Signed In",
            token: token
        })
    }else{
        res.send({
            msg: "Invalid Credentials"
        })
    }
})


//todos
app.post("/todos/add", auth, (req, res)=>{
    const todo=req.body.todo;
    const username=req.username;
    try{
        let userTodo=userTodos.find(x=>x.username===username);
        if (!userTodo){
            res.json({
                msg : "No todo list found"
            })
        }
        const newTodo={
            id: todoId++,
            desc: todo
        }
        userTodo.todos.push(newTodo)
        res.send({
            msg: "Task Added!"
        })
    }catch(err){
        res.json({
            msg : `Error adding todos ${err}`
        })
    }
})

app.get("/todos", auth, (req, res)=>{
    const username=req.username;
    try{
        const userTodo=userTodos.find(t=>t.username===username);
        if (userTodo){
            res.send({
                username: userTodo.username,
                todos: userTodo.todos
            })
        }else{
            res.send({
                msg : "Error occured during refresh"
            })
        }
    }catch(err){
        res.json({
            msg : `Error getting todos (BE): ${err}`
        })
    }
})

app.delete("/todos/delete", auth, (req, res)=>{
    const username=req.username;
    const deleteId=req.body.id;
    const userTodo=userTodos.find(d=>d.username===username);
    if (userTodo){
        userTodo.todos=userTodo.todos.filter(del=>del.id!==deleteId);
        res.send({
            msg : "Todo Deleted"
        })
    }else{
        res.send({
            msg : "Task Not Found"
        })
    }
})

app.put("/todos/edit", auth, (req, res)=>{
    const username=req.username;
    const { id, desc }=req.body;
    try{
        const userTodo=userTodos.find(u=>u.username===username); 
        if (userTodo){
            const todo=userTodo.todos.find(t=>t.id===id);
            if (todo){
                todo.desc=desc;
                res.send({
                    msg : "Successfully Edited Todo",
                    todo: todo
                })
            }else{
                res.json({
                    msg : "Todo Not found"
                })
            }
        }
        else{
            res.json({
                msg : "User Not Found"
            })
        }

    }catch(err){
        res.json({
            msg : `Error while editing ${err}`
        })
    }
})

app.delete("/todos/clear", auth, (req, res)=>{
    try{
        const username= req.username;
        const userTodo=userTodos.find(c=>c.username===username);
        if (userTodo){
            userTodo.todos.length=0;
            res.send ({
                msg : "Todos Cleared"
            })
        }else{
            res.json({
                msg : "Unable to clear Todos"
            })
        }
    }catch(err){
        res.json({
            msg : `Error clearing todos ${err}`
        })
    }
})


app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`)
})

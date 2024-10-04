
const logout=()=>{
    localStorage.removeItem("token");
    alert("You are successully logged out");
    window.location.href="../login_info/index.html";
    
}

const getToDo=async()=>{
    const token=localStorage.getItem("token");
    try{
        const resp=await axios.get("http://localhost:3000/todos", {
            headers: {authorization: token}
        });
        renderToDo(resp.data.todos)
    }catch(err){
        console.log(`Error getting Todos (FE): ${err}`)
    }
}
document.addEventListener("DOMContentLoaded", getToDo)

const renderToDo=(todos)=>{
    const rootDiv=document.getElementById("todos-container");
    rootDiv.innerHTML="";

    if (todos.length === 0) {
        rootDiv.style.display = "none"; // Hide container
        return; // Exit early
    }

    rootDiv.style.display = "block";
    
    todos.forEach(t=>{
        const div=document.createElement("div");
        const para=document.createElement("p");
        const del=document.createElement("button");
        const edit=document.createElement("button");
        div.id="todos-item";
        del.innerHTML="🗑️";
        edit.innerHTML="✏️";
        del.id="delete";
        edit.id="edit";

        del.onclick=()=>deleteToDo(t.id)
        edit.onclick=()=>editToDoFE(t.id, para);

        para.textContent=`• ${t.desc}`
        div.append(para, edit, del);
        rootDiv.append(div);
        
    })
}

const addToDo=async()=>{
    try{
        todo=document.querySelector("input").value;
        if (todo===""){
            alert("Input field cannot be empty")
            return;
        }
        await axios.post("http://localhost:3000/todos/add", { todo }, {
            headers: {authorization: localStorage.getItem("token")}
        })
        document.querySelector("input").value="";
        getToDo()
    }catch(err){
        console.log(`Error adding tasks: ${err}`);
    }
}

const clearToDo=async()=>{
    try{
        await axios.delete("http://localhost:3000/todos/clear", {
            headers: {authorization: localStorage.getItem("token")}
        });
        getToDo()
    }catch(err){
        console.log(`Error during clearing: ${err}`);
    }

}

const editToDoFE=(id, para)=>{
    try{
        const todoDesc=para.textContent.trim().slice(2);
        const newInp=document.createElement("input");
        newInp.type= "text";
        newInp.value=todoDesc;
        para.innerHTML=""; //clearing current text
        para.appendChild(newInp);

        newInp.addEventListener("blur", async()=>{
            const editDesc=newInp.value.trim();
            if (todoDesc!=editDesc){
                try{
                    await axios.put("http://localhost:3000/todos/edit", {
                        id: id,
                        desc: editDesc
                    },
                    {
                        headers: {
                            authorization: localStorage.getItem("token")
                        }
                    })
                    para.textContent=`• ${editDesc}`
                }catch(err){
                    console.log(`Error editing under event Listener: ${err}`)
                }
            }else{
                para.textContent=`• ${todoDesc}` //if there is no change
            }
            getToDo();
        })
        newInp.addEventListener("keydown", (e)=>{
            if (e.key==="Enter"){
                newInp.blur(); //when enter pressed, it saves
            }
        });
        newInp.focus();
    }catch(err){
        console.log(`Error editing : ${err}`)
    }
}

const deleteToDo=async(id)=>{
    try{    
        await axios.delete("http://localhost:3000/todos/delete", {
            data: { id },
            headers:{
                authorization: localStorage.getItem("token")
            }
        })
        getToDo();
    }catch(err){
        console.log(`Error deleting: ${err}`)
    }
}


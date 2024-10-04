
const signup=async ()=>{
    const username=document.getElementById("sign-username").value;
    const password=document.getElementById("sign-password").value;

    await axios.post("http://localhost:3000/signup", {
        username: username,
        password: password
    })
    alert(`You are successfully signed up ${username}`);
    document.getElementById("sign-username").value="";
    document.getElementById("sign-password").value="";
}
const signin=async()=>{
    const username=document.getElementById("sign-username").value;
    const password=document.getElementById("sign-password").value;

    try{
        const resp=await axios.post("http://localhost:3000/signin", {
            username: username,
            password: password
        })
        if (resp){
            localStorage.setItem("token", resp.data.token)
            alert(`You are successfully signed in ${username}`);
            window.location.href="../todo_info/todo.html";
        }else{
            alert("No such user found - Sign up!")
            console.log("Incorrect Credentials")
        }
    }catch(err){
        console.log(err);
    }
}

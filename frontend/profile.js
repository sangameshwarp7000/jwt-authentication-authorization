const profilebtn = document.getElementById("profilebtn")
profilebtn.addEventListener("click", async()=>{
    
    const token = localStorage.getItem("token")

    const response = await fetch(
        "http://localhost:3000/profile",
        {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        }
    )
    const data = await response.text()
    console.log(data)
    
})

const logoutbtn = document.getElementById("logoutbtn")
logoutbtn.addEventListener("click", ()=>{
    localStorage.removeItem('token')
    console.log('Logout Successfull')
    window.location.href='index.html'
})
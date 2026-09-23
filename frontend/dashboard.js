const profilebtn = document.getElementById("dashboardbtn")
profilebtn.addEventListener("click", async()=>{
    
    const token = localStorage.getItem("token")

    const response = await fetch(
        "http://localhost:3000/dashboard",
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
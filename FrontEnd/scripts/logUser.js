//Quand l'utilisateur est connecté,récupérer le token stocké dans localStorage 
const token = window.localStorage.getItem("token")
function loginUser(){
    if(token){
        //Afficher la banner d'édition
        document.querySelector(".edit").style.display = "flex"
        // Changer le text login en logout 
        document.querySelector("nav li:nth-child(3)").textContent = "logout"
        //Cacher les filtres
        document.querySelector("#portfolio ul").style.display = "none"
        document.querySelector("#portfolio .modif").style.display = "flex"
    }
}
loginUser()
function logoutUser(){
    const logout = document.querySelector("nav li:nth-child(3)")
    logout.addEventListener("click",()=>{
        //effacer l'authentification de l'utilisateur
        window.localStorage.removeItem("token")
        window.location.href = "./login/login.html"
    })
}
logoutUser()
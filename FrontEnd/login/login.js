const formLogin = document.querySelector("#login form")
const inputEmail = document.getElementById("email")
const inputPwd = document.getElementById("password")
formLogin.addEventListener("submit", async (event)=>{
    // Éviter le chargement automatique de la page lors de la soumission du formulaire
    event.preventDefault()
    await loginUser()
})
async function loginUser(){
    try {
        const email = inputEmail.value
        const password = inputPwd.value
        if(email !== "" && password !== ""){
            //REQUÊTE FETCH
            const response = await fetch("http://localhost:5678/api/users/login",{
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            if(response.status === 200){
                const dataUser = await response.json()
                //Récupérer le token 
                const dataToken = dataUser.token 
                //Enregistrer dans le localstorage 
                window.localStorage.setItem("token",dataToken)
                //Redirection vers la page d'acceuil
                window.location.href = "../index.html"
            }else{
                throw new Error("Votre e-mail ou votre mot de passe est incorrecte")
            }
        }else{
            throw new Error("Veuillez remplir le champ vide")
        }
    } catch (error) {
        console.error(error.message)
        document.querySelector("#login .error_message").textContent = error.message
        inputEmail.classList.add("error_input")
        inputPwd.classList.add("error_input")
        //Réinitialiser la valeur de email et input à vide
        email.value =""
        password.value = ""        
    }
}
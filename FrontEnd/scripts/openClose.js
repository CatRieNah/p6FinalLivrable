//Ouverture de la modale 
const modalContainer = document.querySelector(".modal-container")
const pModif = document.querySelector(".modif p")
function openModal(){
    pModif.addEventListener("click",(event)=>{
        modalContainer.style.display = "flex"
    })
}
openModal()
//Ouverture de la modale formulaire
const modalForm = document.querySelector(".upload_gallery")
const buttonAddPicture = document.querySelector(".list-picture button")
const modalPicture = document.querySelector(".list-picture")
function openModalForm(){
    buttonAddPicture.addEventListener("click",()=>{
        modalForm.style.display = "flex"
        modalPicture.style.display = "none"  
    })
}
openModalForm()
// Ouverture de la modale de galerie de photo
const arrowLeft = document.querySelector(".fa-arrow-left")
function openModalPicture(){
    arrowLeft.addEventListener("click", ()=>{
        modalPicture.style.display = "block"
        modalForm.style.display = "none"
    })
}
openModalPicture()
//Fermeture de la modale 
function closeModal(){
    modalContainer.addEventListener("click",(event)=>{
        const elementClass = event.target.classList
        if(elementClass.contains("fa-xmark") || elementClass.contains("modal-container")){
            modalContainer.style.display = "none"
            //reinitialiser pour la prochaine ouverture de la modale 
            modalPicture.style.display ="block"
            modalForm.style.display = "none"
        }
    })
}
closeModal()

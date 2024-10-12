import { getWorks } from "./index.js";
import { getCategories } from "./index.js";
import { displayWorksInGallery } from "./index.js";
import { token } from "./logUser.js";
const galleryModal = document.querySelector(".gallery-modal")
async function displayWorksInModal(){
    const works = await getWorks()
    galleryModal.innerHTML =""
    works.forEach(work => {
        const figure = createFigureInModal(work)
        galleryModal.appendChild(figure)
    })
}
function createFigureInModal(work){
    const figure = document.createElement("figure")
    figure.id = work.id
    const img = document.createElement("img")
    img.src = work.imageUrl
    img.alt = work.title 
    const span = document.createElement("span")
    const i = document.createElement("i")
    i.id = work.id
    i.classList.add("fa-solid", "fa-trash-can")
    span.appendChild(i)
    figure.appendChild(img)
    figure.appendChild(span)
    return figure
}
//Suppression des travaux 
export async function deleteWork(){
    await displayWorksInModal()
    const iconsTrash = document.querySelectorAll(".gallery-modal i")
    iconsTrash.forEach(trash => {
        trash.addEventListener("click",async (event)=>{
            const idTrash = event.target.id
            if(idTrash){
                //appel fetch 
                const response = await fetch(`http://localhost:5678/api/works/${idTrash}`,{
                    method: "DELETE",
                    headers: {'Authorization': `Bearer ${token}`}
                })
            }else{
                throw new Error("Suppression non autorisée")
            }
            //Suppression de l'image dans la modale
            const figureModal = document.querySelectorAll(".gallery-modal figure")
            figureModal.forEach(figure => {
                if(figure.id === idTrash){
                    figure.remove()
                }
            });
            //Suppression de l'image dans la galerie 
            const figureGallery = document.querySelectorAll(".gallery figure")
            figureGallery.forEach(figure => {
                if(figure.id === idTrash){
                    figure.remove()
                }
            });
        })
    });
}
deleteWork()
/****FORMULAIRE MODALE ****/
//Récupération des catégories pour select 
const select = document.getElementById("category")
async function displayOptionSelect(){
    const categories = await getCategories()
    categories.forEach(category => {
        createOption(category)
    });
}
displayOptionSelect()
function createOption(category){
    const option = document.createElement("option")
    option.value = category.id
    option.textContent = category.name
    select.appendChild(option)
}
//Affichage de l'image lors de la selection de fichier
const addGallery = document.querySelector(".add_gallery")
let inputFile = document.getElementById("image")
const iconImage = document.querySelector(".fa-image")
const labelImage = document.querySelector(".add_gallery label");
const pImage = document.querySelector(".add_gallery p");
// Ajout eventlistener au changement dans inputFile
inputFile.addEventListener("change",()=>{
    insertImage()
})
//Fonction pour insérer une image 
function insertImage() {
    const files = inputFile.files
    // Réinitialiser le texte d'erreur
    pImage.textContent = "jpg, png : 4mo max";
    pImage.style.color = ""; 
    labelImage.style.display = "flex"
    labelImage.style.justifyContent = "center"
    labelImage.style.alignItems = "center"
    if(files.length > 0){
        const file = files[0] // Récupérer le premier fichier 
        const fileSize = file.size 
        const fileType = file.type 
        //Vérifier si le fichier est en png ou jpeg et ≤ 4Mo
        if((fileType === "image/png"|| fileType === "image/jpeg") && fileSize <= 4*1024*1024){
            // créer une instance pour lire le fichier 
            const reader = new FileReader()
            reader.onload = function(event){
                //Créer une image 
                const image = document.createElement("img")
                image.src = event.target.result // résultat de fileReader
                image.style.width = "100%"
                addGallery.appendChild(image)
                //Supprimer les autres éléments de add_gallery
                iconImage.style.display = "none"
                labelImage.style.display = "none"
                pImage.style.display = "none"
            }
            reader.readAsDataURL(file)
        }else{
            pImage.textContent = "Le fichier doit-être au format jpeg ou png et inférieur ou égal à 4Mo"
            pImage.style.color = "red"
        }
    }
}
// fonction pour verifier tous les champs 
const inputTitle = document.getElementById("title")
const inputSubmitValider = document.querySelector(".upload_gallery input[type = 'submit']")
function checkFields(){
    const title = inputTitle.value
    const category = select.value
    const file = inputFile.files.length
    if(title && category && file > 0){
        inputSubmitValider.style.backgroundColor = "#1D6154"
        inputSubmitValider.disabled = false
        return true 
    }else{
        inputSubmitValider.style.backgroundColor = ""
        inputSubmitValider.disabled = true
        return false 
    }
}
// Ajouter des écouteurs pour vérifier les champs lors des modifications
inputTitle.addEventListener("input", checkFields);
select.addEventListener("input", checkFields);
inputFile.addEventListener("input", checkFields);
// Fonction pour ajouter la photo dans la modale et gallerie
const formUpload = document.querySelector(".upload_gallery form")
formUpload.addEventListener("submit",(event) => {
    event.preventDefault();
    if(checkFields()){
        addPicture()
    }
});
async function addPicture() {
    const formData = new FormData(formUpload);
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {"Authorization": `Bearer ${token}`},
        body: formData
    });
    const data = await response.json();
    displayWorksInModal();
    displayWorksInGallery();
    deleteWork()
    resetForm()
}
//Réinitialisation du formulaire 
function resetForm(){
    inputTitle.value = "";
    select.value = "";
    inputFile.value = ""; 

    // Réafficher les éléments 
    iconImage.style.display = "flex";
    labelImage.style.display = "flex";
    pImage.style.display = "flex";
    
    // Supprimer toutes les images ajoutées dynamiquement
    const img = addGallery.querySelector("img");
    addGallery.removeChild(img)
    // Réinitialiser le bouton de soumission
    inputSubmitValider.style.backgroundColor = "";
    inputSubmitValider.disabled = true;
}



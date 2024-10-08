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
const inputSelect = document.getElementById("category")
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
    inputSelect.appendChild(option)
}
// Affichage de l'image lors de selection de fichier 
const inputFile = document.querySelector(".add_gallery input[type='file']");
inputFile.addEventListener("change", insertImages);

// Définir la fonction insertImages
function insertImages() {
    const files = inputFile.files; // Récupérer tous les fichiers sélectionnés

    for (let i = 0; i < files.length; i++) {
        const file = files[i]; // Fichier actuel
        const reader = new FileReader(); // Créer un nouveau FileReader pour chaque fichier

        // Lorsqu'un fichier est chargé
        reader.onload = function(event) {
            // Créer un élément img
            const image = document.createElement("img");
            image.src = event.target.result; // Utiliser le résultat de FileReader
            image.style.width = "100%"; // Ajuster la taille de l'image

            // Ajouter l'image à la galerie
            const gallery = document.querySelector(".add_gallery");
            gallery.appendChild(image);
        };

        // Lire le fichier sélectionné
        reader.readAsDataURL(file); // Lire le fichier en tant que Data URL
    }

    // Cacher les éléments inutiles après la sélection
    const imageIcon = document.querySelector(".fa-image");
    const label = document.querySelector(".add_gallery label");
    const p = document.querySelector(".add_gallery p");

    if (imageIcon) {
        imageIcon.style.display = "none";
    }
    if (label) {
        label.style.display = "none";
    }
    if (p) {
        p.style.display = "none";
    }
}

// Envoi formulaire ajout photo
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");
const formUpload = document.querySelector(".upload_gallery form");

formUpload.addEventListener("submit", (event) => {
    event.preventDefault();
    if (checkFields()) {  // Vérifier les champs avant d'ajouter l'image
        addPicture();
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
    
    const addGallery = document.querySelector(".add_gallery");
    addGallery.innerHTML = ""; // Vider la galerie après l'ajout
    
    displayWorksInModal();
    displayWorksInGallery();
    resetForm();
}

// Vérification des champs
function checkFields() {
    const title = titleInput.value;
    const category = categoryInput.value;
    const image = imageInput.files.length;
    
    const submitButton = document.querySelector(".upload_gallery input[type='submit']");
    if (title && category && image > 0) {
        if (submitButton) {
            submitButton.style.backgroundColor = "#1D6154"; // Couleur si tous les champs sont valides
        }
        return true; // Tous les champs sont remplis correctement
    } else {
        if (submitButton) {
            submitButton.style.backgroundColor = ""; // Couleur par défaut si pas tous les champs valides
        }
        return false; // Un ou plusieurs champs ne sont pas remplis correctement
    }
}

// Écoute des entrées pour vérifier les champs
titleInput.addEventListener("input", checkFields);
categoryInput.addEventListener("input", checkFields);
imageInput.addEventListener("input", checkFields);

// Réinitialiser le formulaire
function resetForm() {
    // Réinitialiser les champs du formulaire
    titleInput.value = "";
    categoryInput.value = "";

    // Réinitialiser l'input de fichier en le recréant
    const newInputFile = document.createElement("input");
    newInputFile.type = "file";
    newInputFile.name = "image";
    newInputFile.id = "image";
    newInputFile.accept = "image/png,image/jpeg";

    // Remplacer l'ancien input par le nouveau
    const addGallery = document.querySelector(".add_gallery");
    addGallery.innerHTML = `
        <span><i class="fa-regular fa-image"></i></span>
        <label for="image">+ Ajouter photo</label>
    `;
    addGallery.appendChild(newInputFile);
    newInputFile.addEventListener("change", insertImages);
}
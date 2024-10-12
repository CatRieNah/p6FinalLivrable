//Récupération des travaux à partir du back-end 
export async function getWorks() {
    try {
        //Appel fetch 
        const response = await fetch("http://localhost:5678/api/works")
        if(response.status === 200){
            const works = await response.json()
            return works
        }else{
            throw new Error(`Error: ${response.status}`)
        }
    } catch (error) {
        console.error(error)
    }
}
//Ajouter les travaux 
const gallery = document.querySelector("#portfolio .gallery")
 export async function displayWorksInGallery() {
    const works = await getWorks()
    //Mis à jour de la gallery à chaque ajout de photo
    gallery.innerHTML = ""
    works.forEach(work => {
        const figure = createFigureInGallery(work)
        gallery.appendChild(figure)
    });
}
function createFigureInGallery(work){
    const figure = document.createElement("figure")
    figure.id = work.id
    const img = document.createElement("img")
    img.src = work.imageUrl
    img.alt = work.title
    const figcaption = document.createElement("figcaption")
    figcaption.textContent = work.title
    figure.appendChild(img)
    figure.appendChild(figcaption)
    return figure
}
displayWorksInGallery()
/*Récupérer les catégories pour les filtres via les données récues 
async function getCategories() {
    const works = await getWorks()
    const categories = []
    const setCat = new Set()
    works.forEach(work => {
        const idCategory = work.category.id
        const nameCategory = work.category.name
        setCat.add(idCategory)
        setCat.add(nameCategory)
    });
    const arraySet = [... setCat]
    for(let i = 0; i < arraySet.length; i+=2){
        const id = arraySet[i]
        const name = arraySet[i+1]
        categories.push({
            id: id,
            name: name
        })
    }
    return categories
} LORSQU'ON SUPPRIME LES TRAVAUX, ÇA SUPPRIME AUSSI LES FILTRES VU QUE LES CATEGORIES SONT AJOUTÉES À PARTIR DES DONNÉES RÉCUES */
//Récupérer les catégories via back-end 
export async function getCategories() {
    try {
        //Appel fetch 
        const response = await fetch("http://localhost:5678/api/categories")
        if(response.status === 200){
            const categories = await response.json()
            return categories
        }else{
            throw new Error(`Error: ${response.status}`)
        }
    } catch (error) {
        console.error(error)
    }
}
getCategories()
//Affichage des filtres 
const portfolio = document.getElementById("portfolio")
const ul = document.createElement("ul")
//insérer ul avant gallery 
portfolio.insertBefore(ul,gallery)
//Créer le filtre par defaut 
function createFilterDefault(){
    const li = document.createElement("li")
    li.id = "default"
    li.textContent = "Tous"
    ul.appendChild(li)
}
createFilterDefault()
//Créer les filtres par catégories
async function createFilterCategories() {
    const categories = await getCategories()
    categories.forEach(category => {
        const li = document.createElement("li")
        li.id = category.id
        li.textContent= category.name
        ul.appendChild(li)
    });
}
createFilterCategories()
//Filtrage des travaux 
async function changeBackgroundFilter() {
    const categories = await getCategories()
    const filters = document.querySelectorAll("#portfolio li")
    for(let i = 0; i < filters.length; i++){
        const filter = filters[i]
        filter.addEventListener("click",(event)=>{
            //reinitialise la class de toutes les filtres
            filters.forEach(filter => {
                filter.classList.remove("filter-active")
            });
            event.target.classList.add('filter-active')
        })
    }
}
changeBackgroundFilter()
//Filtrage des travaux 
async function filterWorks() {
    const works = await getWorks()
    const categories = await getCategories()
    const listFilters = document.querySelectorAll("#portfolio li")
    listFilters.forEach(filter => {
        filter.addEventListener("click",(event)=>{
            // mis à jour de la gallery à chaque clic de filtre 
            gallery.innerHTML = ""
            const idFilter = event.target.id
            if(idFilter === "default"){
                displayWorksInGallery()
            }else{
                const worksFiltered = works.filter((work=> work.category.id == idFilter))
                worksFiltered.forEach(work => {
                    const figure = createFigureInGallery(work)
                    gallery.appendChild(figure)
                });
            }
        })
    });   
}
filterWorks()
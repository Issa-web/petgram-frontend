BASE_URL = 'http://localhost:3000/'

PETS_URL = BASE_URL + 'pets'


document.addEventListener("DOMContentLoaded", () => {

    loginModal();



    // renderPets(); 
});


// Render Pets 
const renderPets = () => {
    // clear working space 
    let workingSpace = document.getElementById("working-space") 
    workingSpace.innerHTML = '';

    fetchPets();
}


const fetchPets = () => {
    fetch(PETS_URL)
    .then(resp => resp.json())
    .then(pets => {
        console.log(pets)
        pets.forEach(pet => {
            renderPet(pet);
        })
    })
}

const renderPet = (pet) => {
    let workingSpace = document.getElementById("working-space")
    // workingSpace.innerHTML = ''

    // create pet div card 
    let petCard = document.createElement('div')
    petCard.className = 'pet-card'
    workingSpace.appendChild(petCard)


    // name
    let petName = document.createElement('div')
    petName.innerText = `${pet.name} the ${pet.animal}`
    petCard.appendChild(petName)

    // picture
    let imgDiv = document.createElement('div')
    let petPic = document.createElement('img')
    petPic.id = 'pet-pic'
    petPic.src = pet.pic_url
    imgDiv.appendChild(petPic)
    petCard.appendChild(imgDiv)

    // description 
    let description = document.createElement('div')
    description.innerText = pet.description 
    petCard.appendChild(description)

}



// };

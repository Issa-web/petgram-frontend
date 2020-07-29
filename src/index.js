BASE_URL = 'http://localhost:3000/'

USERS_URL = BASE_URL + 'users'

PETS_URL = BASE_URL + 'pets'


document.addEventListener("DOMContentLoaded", () => {
    // when user goes to link, page loads and sees login modal. 
    loginModal();

    // renderPets(); 
});


// Login Modal 

const loginModal = () => {
    document.getElementById('login-modal').style.display = 'flex';
    let form = document.querySelector('form');

    // adding event listener to the submit button on login form
    submitLogin(form);
    // if user clicks button, sends to the newuser modal
    createNewUserButton();
}

// handles the click of the button "create new user"
const createNewUserButton = () => {
    const createButton = document.getElementById('create-new-user')
    createButton.addEventListener('click', (e) => {
        document.getElementById('login-modal').style.display = 'none';
        newUserFormModal();
    })
}

// handles a submit event listener 
const submitLogin = (form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let username = e.target[0].value
        checkUser(username);
    })
}

// check if username exists within database 

const checkUser = (username) => {
    fetch(USERS_URL)
    .then(resp => resp.json())
    .then(users => {
        let user = users.find(user => {
            return (user.name.toLowerCase() == username.toLowerCase()) 
    })
    if (user == undefined){
        console.log("No user found! Please create a new user.")
        newUserFormModal()
    } else {
        console.log('User found!')
        clearLoginModal();
        showUser(user)
    }
})
}

// a form for creating a new User 
const newUserFormModal = () => {
    let newUserModal = document.getElementById('new-user-modal')
    newUserModal.style.display = 'flex'
    let newUserForm = document.getElementById('new-user')
    let backToLogin = document.getElementById('back-to-login')
    
    backToLogin.addEventListener('click', (e) => {
        newUserModal.style.display = 'none'
        document.getElementById('login-modal').style.display = 'flex';
    })

    newUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let newUsername = newUserForm[0].value 
        // do a fetch request to post to users and create a new user. 

        // check if username is taken before adding in a new user 
        fetch(USERS_URL)
        .then(resp => resp.json())
        .then(users => {
            let user = users.find(user => {
                return (user.name.toLowerCase() == newUsername.toLowerCase())
            })
            if (user == undefined){
                fetchCreateUser(newUserForm);
                console.log("Username Created!")
            } else {
                alert("Username has been taken! Please choose another!")
            }
    
        })
        
    })

}

// a function that sends a fetch(post) request to create a new user. 
const fetchCreateUser = (newUserForm) => {
    options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            name: newUserForm[0].value
        })
    }

    fetch(USERS_URL, options)
    .then(resp => resp.json())
    .then(user => {
        // once a new user is created, clear out modal screens and take new user to first page.

        
        clearLoginModal();
        console.log(user)
        
        showUser(user);
    })
}

// a function that clears the login modal to enter into application 
const clearLoginModal = () => {
    document.getElementById('new-user-modal').style.display = 'none';
    document.getElementById('login-modal').style.display = 'none';

}

// A function that, once logged in, takes us into the application. 
const showUser = (user) => {
    let workingSpace = document.getElementById("working-space") 
    workingSpace.innerHTML = '';
    const profileDiv = document.createElement('div')
    profileDiv.id = 'profile-div'
    workingSpace.appendChild(profileDiv);

    const profileName = document.createElement('div')
    profileName.id = 'profile-name'
    profileName.innerText = user.name
    profileDiv.appendChild(profileName)

    const petTitle = document.createElement('div')
    petTitle.id = 'pet-title'
    petTitle.innerText = "All pets"
    profileDiv.appendChild(petTitle)

    // iterate through all pets and 
    // display the picture of the pet under the pet title div.
    user.pets.forEach(pet => {

        const petCard = document.createElement('div')
        petCard.classList = 'pet-card'
        petTitle.appendChild(petCard)

        let petPic = document.createElement('img')
        petPic.classList = 'pet-pic'
        petPic.src = pet.pic_url
        petCard.appendChild(petPic)

        // when a user clicks on a pet image/card, it will take the user
        // to the pet view page

        petCard.addEventListener('click', (e) => {
            console.log('you clicked this pet!')
            console.log(pet)
            // once the pet is clicked, render that pets page
            renderPet(pet);
        })
    })

}



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
    workingSpace.innerHTML = ''

    // create pet div card 
    let petCard = document.createElement('div')
    petCard.className = 'pet-page-card'
    workingSpace.appendChild(petCard)


    // name
    let petName = document.createElement('div')
    petName.innerText = `${pet.name} the ${pet.animal}`
    petCard.appendChild(petName)

    // picture
    let imgDiv = document.createElement('div')
    let petPic = document.createElement('img')
    petPic.id = 'pet-page-pic'
    petPic.src = pet.pic_url
    imgDiv.appendChild(petPic)
    petCard.appendChild(imgDiv)

    // description 
    let description = document.createElement('div')
    description.innerText = pet.description 
    petCard.appendChild(description)

}


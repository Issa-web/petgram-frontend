BASE_URL = 'http://localhost:3000/'
USERS_URL = BASE_URL + 'users'
PETS_URL = BASE_URL + 'pets'
USER_PETS_URL = BASE_URL + 'user_pets'
POSTS_URL = BASE_URL + 'posts'

window.allUsers = 'All the users'


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
        window.allUsers = users
        let user = users.find(user => {
            return (user.name.toLowerCase() == username.toLowerCase()) 
    })
    if (user == undefined){
        console.log("No user found! Please create a new user.")
        newUserFormModal()
    } else {
        console.log('User found!')
        clearLoginModal();
        showUser(user);

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
    let main = document.getElementById('main')

    let workingSpace = document.getElementById("working-space") 
    main.removeChild(workingSpace)
    
    main.innerText = user.name

    petButtonLogo(user);


    workingSpace.innerHTML = '';
    main.appendChild(workingSpace)
    const profileDiv = document.createElement('div')
    profileDiv.id = 'profile-div'
    workingSpace.appendChild(profileDiv);

    const profileName = document.createElement('div')
    profileName.id = 'profile-name'
    profileName.innerText = `${user.name}'s pets`
    profileDiv.appendChild(profileName) 

    const petTitle = document.createElement('div')
    petTitle.id = 'pet-title'
    // petTitle.innerHTML = "<button id='add-pet-button'>Add Pet</button>"
    profileDiv.appendChild(petTitle)

    // iterate through all pets and 
    // display the picture of the pet under the pet title div.

    user.pets.forEach((pet) => {       
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
            // once the pet is clicked, render that pets page
            renderPet(pet, user);
        })
    })

}

// Seperate out the addPetButton from the showUser Function 
const petButtonLogo = (user) => {
    let main = document.getElementById('main')
    const addPetButton = document.createElement('img')
    addPetButton.src = './images/plus-sign-svg.png'
    addPetButton.id = 'add-pet-button'
    main.appendChild(addPetButton)
    addPetButtonHandler(addPetButton, user);
}

// Add a pet when a button is pressed 
const addPetButtonHandler = (addPetButton, user) => {
    
    
    addPetButton.addEventListener('click', (e) => {
        e.preventDefault();
        newPetModal = document.getElementById("new-pet-modal")
        newPetModal.style.display = 'flex';
        newPetForm = document.getElementById('new-pet');
        newPetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let newPetName = newPetForm[0].value;
            let newPicUrl = newPetForm[1].value;
            let newDescription = newPetForm[2].value;
            let newAnimal = newPetForm[3].value;

            fetchCreatePet(newPetForm, user);

        }, {once: true})

        document.querySelector('.close').addEventListener('click', () => {
            const newPetModal = document.getElementById("new-pet-modal")
            newPetModal.style.display = 'none';
        })
    })

    
}

// Create a new pet 
const fetchCreatePet = (newPetForm, user) => {
    options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            name: newPetForm[0].value,
            pic_url: newPetForm[1].value,
            description: newPetForm[2].value,
            animal: newPetForm[3].value
        })
    }

    fetch(PETS_URL, options)
    .then(resp => resp.json())
    .then(pet => {
        // create the userPet relationship once a pet is created.
        fetchCreateUserPet(pet, user)
    })

}

// Create UserPet relationship 

const fetchCreateUserPet = (pet, user) => {
    options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            pet_id: pet.id, 
            user_id: user.id
        })
    }

    fetch( USER_PETS_URL, options)
    .then(resp => resp.json())
    .then(userPet => {
    // once a new pet is created, clear out modal and take user to pet page.
        newPetModal = document.getElementById("new-pet-modal")
        newPetModal.style.display = 'none';
    // Once modal is cleared out, render profile page. 
    // we first have to fetch AGAIN all the users, to update ALL users with
    // the updated userpet relationship. 
    updateAllUsers(userPet, user);
    })
}

// updates all users
const updateAllUsers = (userPet, user) => {
    fetch(USERS_URL)
    .then(resp => resp.json())
    .then(users => {
        users.find(user => {
            if(user.id == userPet.user_id) {
                // its showing double of the pets after each add
                showUser(user)
                // petButtonLogo(user)
            }
        
    
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
        pets.forEach(pet => {
            renderPet(pet);
        })
    })
}

const renderPet = (pet, user) => {
    let mainPetPage = document.getElementById('main')
    mainPetPage.innerHTML = ''

    // pet picture top middle

    let petPicture = document.createElement('img')
    petPicture.src = pet.pic_url
    petPicture.id = 'pet-page-pet-pic'
    mainPetPage.appendChild(petPicture)
    
    // pet name right under pet profile picture 

    let petName = document.createElement('div')
    petName.innerText = `${pet.name} the ${pet.animal}` 
    mainPetPage.appendChild(petName)
    
    let petDescription = document.createElement('div')
    petDescription.id = 'pet-description'
    petDescription.innerText = pet.description
    mainPetPage.appendChild(petDescription)

    const petPosts = document.createElement('div')
    petPosts.id = 'pet-posts'
    mainPetPage.appendChild(petPosts)

  
    const postButton = document.createElement('img')
    postButton.src = './images/plus-sign-svg.png'
    postButton.id = 'add-post-button'
    mainPetPage.appendChild(postButton);
    postButtonHandler(postButton, pet, user);


}

const postButtonHandler = (postButton, pet, user) => {
    postButton.addEventListener('click', (e) => {
        e.preventDefault();
        const newPostModal = document.getElementById("new-post-modal")
        newPostModal.style.display = 'flex';
        newPostForm = document.getElementById('new-post');


        submitEventHandler(newPostForm, pet, user);

        const closeButton = document.getElementById('post-close')
        closeButton.addEventListener('click', () => {
            newPostModal.style.display = 'none';
        })

    })
}


const submitEventHandler = (newPostForm, pet, user) => {

    newPostForm.addEventListener('submit', (e) => {
        e.preventDefault()

        let newPicUrl = newPostForm[0].value;
        let newCaption = newPostForm[1].value;
        let petId = pet.id;
        let userId = user.id;

        body = {pic_url: newPicUrl, caption: newCaption, pet_id: petId, user_id: userId}

        fetchCreatePost(pet, user, newPostForm)


        


    }, {once: true})

}

const fetchCreatePost = (pet, user, newPostForm) => {
    options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            pic_url: newPostForm[0].value,
            caption: newPostForm[1].value,
            pet_id: pet.id,
            user_id: user.id
        })
    }

    fetch(POSTS_URL, options)
    .then(resp => resp.json())
    .then(post => {
        // render the posts onto the div container
        renderPost(post);

        newPostForm = document.getElementById('new-post-modal');
        newPostForm.style.display = 'none';
    })
}


const renderPost = (post) => {
    console.log(post)
    const petPosts = document.getElementById('pet-posts')

    const postDiv = document.createElement('div')
    postDiv.classList = 'post-div'
    petPosts.appendChild(postDiv);

    const postPic = document.createElement('img')
    postPic.classList = 'post-img'
    postPic.src = post.pic_url
    postDiv.appendChild(postPic)

    const postCaption = document.createElement('p')
    postCaption.innerText = post.caption 
    postCaption.id = 'post-caption'
    postDiv.appendChild(postCaption)

 

    
}
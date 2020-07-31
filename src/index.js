BASE_URL = 'http://localhost:3000/'
USERS_URL = BASE_URL + 'users'
PETS_URL = BASE_URL + 'pets/'
USER_PETS_URL = BASE_URL + 'user_pets'
POSTS_URL = BASE_URL + 'posts/'
COMMENTS_URL = BASE_URL + 'comments/'
LIKES_URL = BASE_URL + 'likes/'

window.allUsers = 'All the users'

let allThePosts = [];
let thisPost = ''

let glyphStates = {
    "♡": "♥",
    "♥": "♡"
};

let colorStates = {
    "red" : "",
    "": "red"
};


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
    profileName.innerText = `Your pets`
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

    const postButton = document.createElement('img')
    postButton.src = './images/plus-sign-svg.png'
    postButton.id = 'add-post-button'
    mainPetPage.appendChild(postButton);
    postButtonHandler(postButton, pet, user);


    const petPosts = document.createElement('div')
    petPosts.id = 'pet-posts'
    // on first load, render all posts of the pet that exists 
    mainPetPage.appendChild(petPosts)
    renderPostsHandler(pet, user);

    // 

    
  
    

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
        renderPost(post, user);

        newPostForm = document.getElementById('new-post-modal');
        newPostForm.style.display = 'none';
    })
}


const renderPost = (post, user) => {
    const petPosts = document.getElementById('pet-posts')

    const postDiv = document.createElement('div')
    postDiv.classList = 'post-div'
    petPosts.appendChild(postDiv);

    const postPic = document.createElement('img')
    postPic.classList = 'post-img'
    postPic.src = post.pic_url
    postDiv.appendChild(postPic)


    // when the modal window pops up, we can view the caption there.

    // const postCaption = document.createElement('p')
    // postCaption.innerText = post.caption 
    // postCaption.id = 'post-caption'
    // postDiv.appendChild(postCaption)

    viewPostHandler(postDiv, post, user);

    
}

const renderPostsHandler = (pet, user) => {
    // do a fetch request that gets all posts, we have the pet.id, use that pet.id to match to the posts with the same
    // pet.id

    fetchAllPosts(pet, user);
}

const fetchAllPosts = (pet, user) => {

    fetch(POSTS_URL)
    .then(resp => resp.json())
    .then(posts => {
        allThePosts.push(posts)
        posts.forEach(post => {
            if (pet.id == post.pet_id){
                renderPost(post, user);
            }
        })
    })

}


// handler that allows a post to show a modal window when clicked about the post. 

const viewPostHandler = (postDiv, post, user) => {

    postDiv.addEventListener('click', (e) => {
        e.preventDefault();
        const viewPostModal = document.getElementById('view-post-modal')
        viewPostModal.style.display = 'flex'

        // make seperate function that handle render on view post modal
        renderStuffForViewModal(post, user);


        let viewPostClose = document.getElementById('view-post-close')
        viewPostClose.addEventListener('click', () => {
            viewPostModal.style.display = 'none'
            const commentsContainer = document.getElementById('comments-container')
            commentsContainer.innerHTML = '';
        })


    })

    // grab the modal window. Show the modal window. show the picture on the left
    //  show the caption on the top right. have a captions section below the caption 
    // show likes on the picture as well. 
}

const renderStuffForViewModal = (post, user) => {
    const modalContent = document.getElementById('view-post-modal-content')
    const viewPostImg = document.getElementById('view-post-img')
    viewPostImg.src = post.pic_url

    const viewPostCaption = document.getElementById('view-post-caption')
    viewPostCaption.innerText = post.caption


    const articleHearts = document.querySelector(".like-glyph");
    const likeCount = document.getElementById('like-count')

    let heart = articleHearts; 
    heart.innerText = "♡";
    heart.style.color = 'black';
    likeCount.innerText = 'No one likes this yet!';

    showPreviousLikes(user, post);

    showPreviousComments(post);

    likeHandler(post, user);

    viewCommentHandler(post, user);

}

const viewCommentHandler = (post, user) => {
    const viewPostComments = document.getElementById('view-post-comments')

  

    viewPostComments.addEventListener('submit', (e) => {
        e.preventDefault();

        fetchCreateComment(viewPostComments, post, user)
    }, {once: true})
    
}

const fetchCreateComment = (viewPostComments, post, user) => {
    options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            comment: viewPostComments[0].value,
            user_id: user.id,
            post_id: post.id
        })
    }

    fetch(COMMENTS_URL, options)
    .then(resp => resp.json())
    .then(comment => {
        // render the comment on the view modal 
        renderCommentToModal(comment);
    })
}

const renderCommentToModal = (comment) => {

    // we should only render the comments of that certain post
    // clear the comment section of the modal before rendering it again.
    

    // find the user name from comment 
    const userId = comment.user_id
    const commentsContainer = document.getElementById('comments-container')

    fetch(USERS_URL)
    .then(resp => resp.json())
    .then(allUsers => {

        allUsers.forEach( user => {
            if (user.id == comment.user_id){
                let userNameOfComment = user.name
                
                const userComment = document.createElement('div')
                userComment.classList = 'user-comment'
                userComment.id = `${comment.id}`
                userComment.innerHTML = `<span id='user-name-of-comment'>${userNameOfComment}</span>: ${comment.comment} <span id='comment-${comment.id}' class='delete-comment'>X</span> `
                commentsContainer.appendChild(userComment)
    
                const deleteCommentSpan = document.getElementById(`comment-${comment.id}`)
                deleteCommentSpan.addEventListener('click', ()=> {
                    // once we clicked the specific comments delete button, we send a fetch to destroy! 
                    deleteComment(comment, userComment);
                })
            }
        })

    })
    

}

const showPreviousComments = (post) => {
    // fetch request all posts, find all the comments that match the clicked post id and display those 
    fetch(COMMENTS_URL)
    .then(resp => resp.json())
    .then(allComments => {
        allComments.forEach(comment => {
            if(comment.post_id == post.id){
                renderCommentToModal(comment);
            }
        })
    })
}


const deleteComment = (comment, userComment) => {

    console.log(`${comment.id} was clicked!`)

    // when we fetch, we have to fetch by the commentsurl/id 
    fetch((COMMENTS_URL + comment.id), { method: 'delete'})
    .then( resp => resp.json())
    .then( deletedComment => {

        if (deletedComment.errors){
            makesAlerts( deletedComment.errors)
        } else {
            // remove the front end comment
            userComment.remove();
            console.log( deletedComment.messages )
            
        }
    })

}

function makesAlerts( messages ) {
    messages.forEach( message => alert(message) )
}


const likeHandler = (post, user) => {
    const articleHearts = document.querySelector(".like-glyph");
    const postImg = document.getElementById('view-post-img');

    postImg.addEventListener('dblclick', (e) => {
        console.log('I have been double clicked!')
        checkIfUserLiked(user, post);
    })

  
    articleHearts.addEventListener('click', (e) => {
        checkIfUserLiked(user, post);
    })
}

// when a like button or double click happens, CREATE a like object, when clicked again, delete

const createLike = (post, user) => {
    const heartLike = document.querySelector(".like-glyph").innerText

    options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            like: heartLike,
            user_id: user.id,
            post_id: post.id
        })
    }

    fetch(LIKES_URL, options)
    .then(resp => resp.json())
    .then(like => {

        // we redo the fetch request for posts here
        fetch(POSTS_URL)
        .then(resp => resp.json())
        .then(posts => {
            posts.forEach(post => {
                if (post.id == like.post_id) {
                    renderLikeToModal(post)
                }
            })
        })
    })
}



const renderLikeToModal = (post) => {

    const articleHearts = document.querySelector(".like-glyph");
    const likeCount = document.getElementById('like-count')

    let heart = articleHearts; 
    heart.innerText = '';
    likeCount.innerText = 'No one likes this yet!';
    let countOfLikers = post.likes.length

    if (countOfLikers === 0){
        heart.innerText = "♡"
        heart.style.color = 'black';
    } else if (countOfLikers === 1) {
        heart.innerText = "♥"
        heart.style.color = 'red';
        likeCount.innerText = `liked by ${post.likes.length} person`
    } else {
        heart.innerText = "♥"
        heart.style.color = 'red';
        likeCount.innerText = `liked by ${post.likes.length} people`
    }
    
    // check if like exists in database, if it exists, turn the glyph "off" by fetch deleting the like
    // if it doesn't exist, create an instance of like. 

}

const checkIfUserLiked = (user, post) => {
    // if the user had already liked the post, if they click the post again to like, it will delete the like 
    //  if the user had not liked the post, it will create a like. 
    // First we will need to fetch ALL likes, then go through all the likes that having a matching user_id with user.id
    // AND have the like.post_id match the POST.id. 

    let allLikesForCheck = [];

    fetch(LIKES_URL)
    .then(resp => resp.json())
    .then(allLikes => {
        allLikes.forEach(like => {

            allLikesForCheck.push(like)
        })

        let userLike = allLikesForCheck.find(like => {
            return (like.user_id == user.id && like.post_id == post.id)
        })

        if (userLike == undefined){
            // createLike
            createLike(post, user);
        } else {
            // if like has been LIKED by the user, delete the like
            deleteLike(userLike, post);
        }

    })


}

const showPreviousLikes = (user, post) => {
    // fetch request all likes, find all the likes that match the clicked post id and display those 
    fetch(LIKES_URL)
    .then(resp => resp.json())
    .then(allLikes => {
        allLikes.forEach(like => {
            if(like.post_id == post.id){
                renderLikeToModal(post);

            } 
        })
    })
}

const deleteLike = (like, post) => {

    // delete fetch and rerender the modal with the updated like number
    fetch((LIKES_URL + like.id), { method: 'delete'})
    .then( resp => resp.json())
    .then( deletedLike => {
        if (deletedLike.errors){
            makesAlerts( deletedLike.errors)
        } else {
            // re-render the like modal page to show updated like count 
            renderLikeToModal(post)
        }
    })

}

// const deleteComment = (deleteCommentSpan, comment, userComment) => {

//     console.log(`${comment.id} was clicked!`)

//     // when we fetch, we have to fetch by the commentsurl/id 
//     fetch((COMMENTS_URL + comment.id), { method: 'delete'})
//     .then( resp => resp.json())
//     .then( deletedComment => {

//         if (deletedComment.errors){
//             makesAlerts( deletedComment.errors)
//         } else {
//             // remove the front end comment
//             userComment.remove();
//             console.log( deletedComment.messages )
            
//         }
//     })

// }
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";










let hi                 = document.querySelector('section.hi');
let readme             = document.querySelector('section.readme');
let tabsButtons        = document.querySelectorAll('button.tabs');
let roll               = document.querySelector('.roll');
let paginationWrapper  = document.querySelector('section.readme .count_slide');
let paginationDots     = document.querySelectorAll('section.readme .count_slide .dot');
let goLoginButton      = document.querySelector('.goLogin');
let imgEye             = document.querySelector('.global_input img.modify');
let backButtons        = document.querySelectorAll('.backButton');
let uploadTabs         = document.querySelectorAll('.uploadTab');
let variantDfinity     = document.querySelector('.variant.dfinity');
let checkNameDate      = document.querySelector('.checkNameDate');
let uploadPhotos       = document.querySelector('.uploadPhoto');
let newNameInput       = document.querySelector('.newName');
let newDateInput       = document.querySelector('.newDate');
let logOut             = document.querySelector('.logOut');
let tabReadme          = document.querySelectorAll('.tab.readme');
let uploadImputs       = document.querySelectorAll('.photo_matrix input');
let authClient;
const init = async () => {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
        tabReadme.forEach((el) => {
            el.remove();
        });
    } 
    
  
    variantDfinity.onclick = async () => {
      await authClient.login({
        onSuccess: async () => {
            runRoll();
          handleAuthenticated(authClient);
          console.log('успешно вошли и переходим к заполнению профиля');
        },
      });
    };
  };


  async function handleAuthenticated(authClient) {
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity }); 

}
init();



logOut.addEventListener('click', async function() {

    if (await authClient.isAuthenticated()) {
        authClient.logout();
    }
});

setTimeout(() => {
    fadeOut(hi, 10)
}, 2000);

setTimeout(() => {
    runRoll();
}, 3000);

function fadeOut(element, time) {
    let opacity = 0.99;
    let interval = setInterval(() => {
        element.style.opacity = opacity;
        opacity -= 0.01;
        if (opacity <= 0) {
            element.remove();
            clearInterval(interval);
        }
    }, time);
};

let offset = 0;
let paginationBtns = 0;
tabsButtons.forEach((el) => {
    el.addEventListener('click', function() {
        runRoll();
    });
});

function runRollBack() {
    offset -= 400;
    roll.style.transform = 'translateX(-'+ offset +'px)';
}

function runRoll() {
    offset += 400;
    paginationBtns += 1;
    roll.style.transform = 'translateX(-'+ offset +'px)';
    paginationDots.forEach((x) => {
        x.classList.remove('active');
    });
    let activeDot = document.querySelector('.dot[tab="'+ paginationBtns +'"]');
    if (activeDot) {activeDot.classList.add('active'); } else {paginationWrapper.remove()}
    
}


imgEye.addEventListener('click', function() {
    let sosedInput = document.querySelector('.login_password');
    let attr = sosedInput.getAttribute('type');
    if (attr == 'password') {sosedInput.setAttribute('type','text')} else {sosedInput.setAttribute('type','password')}
});

checkNameDate.addEventListener('click', function() {
    if (newNameInput.value == "") {
        newNameInput.classList.add('inputError');
    } else if (newDateInput.value == "") {
        newDateInput.classList.add('inputError');
    } else {runRoll();}
});

uploadPhotos.addEventListener('click', function() {
    runRoll();
});

backButtons.forEach((el) => {
    el.addEventListener('click', function() {
        runRollBack();
    });
});


uploadTabs.forEach((el) => {
    el.addEventListener('click', function() {
        uploadTabs.forEach((x) => {
            x.classList.remove('active');
        });
        el.classList.add('active');
    });
});

uploadImputs.forEach((el) => {
    el.addEventListener('change', function(event) {
        onFileSelected(event)
    });        
});   
function onFileSelected(event) {

    let selectedFile = event.target.files[0];
    let reader = new FileReader();
  
    reader.onload = function(event) {
        let boxWrapper = document.querySelector('.selectPhotos');
        let newBox = `
        <div class="photoBox">
            <img class="user" src="${event.target.result}" alt="">
        </div>
        `;
        boxWrapper.innerHTML += newBox;
    };
    reader.readAsDataURL(selectedFile);
}






import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { tin } from "../../declarations/tin";
import { setUncaughtExceptionCaptureCallback } from "process";




let preloader          = document.querySelector('.preloader');
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
let gear               = document.querySelector('.gear');
let tabReadme          = document.querySelectorAll('.tab.readme');
let uploadImputs       = document.querySelectorAll('.photo_matrix input');
let createUser         = document.querySelector('.createUser');
let newName            = document.querySelector('input.newName');
let newBirthDate       = document.querySelector('input.newDate');
let ifProfile         = document.querySelectorAll('.ifProfile');

let authClient;

function preloaderOn() {
    preloader.classList.add('active');
};

function preloaderOff() {
    preloader.classList.remove('active');
};

const init = async () => {
    authClient = await AuthClient.create();
    console.log(authClient.isAuthenticated());
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

gear.addEventListener('click', async function() {
    preloaderOn();
    let res = await tin.delete();
    if (await authClient.isAuthenticated()) {
        authClient.logout();
    }
    preloaderOff();
    console.log(res);
    location.reload();
});

async function getProfile(rollBacks) {
    preloaderOn();
    let res = await tin.read();
    preloaderOff();
    if (res.length > 0) {

        console.log(res);
        let name = document.querySelector('.name_age_box .name');
        let dateOfBirth = document.querySelector('.name_age_box .age');
        name.innerHTML = res[0].userData.name;
        dateOfBirth.innerHTML = res[0].userData.dateOfBirth;
        let profilePhotos = res[0].userData.profilePhotos;
        let profilePhotosWrap = document.querySelector('.selectPhotosWrap');
        let mainPhoto = document.querySelector('.left .photo_box img');
        mainPhoto.src = profilePhotos[0][0];
        profilePhotos.forEach((el) => {
            let child = '<div class="child"><img src="'+ el[0] +'" alt=""></div>';
            profilePhotosWrap.innerHTML += child;
        });

        ifProfile.forEach((el) => {
            el.remove();
        });
        if (rollBacks == 3) {
            runRollBack();
            runRollBack();
            runRollBack();
        }
        if (rollBacks == 1) {

        }



    };
};

getProfile(1);

createUser.addEventListener('click', async function() {
    preloaderOn();
    let name = newName.value;
    let birthDate = newBirthDate.value;
    let photos = document.querySelectorAll('.selectPhotos .photoBox');
    let photosArray = [];
    photos.forEach((el) => {
        photosArray.push([el.querySelector('img').src]);
    });
    console.log(name);
    console.log(birthDate);
    console.log(photosArray);

    let userData = {
        userData : {
            dateOfBirth : [birthDate],
            name : [name],
            profilePhotos : photosArray
        }
    };
    let res = await tin.create(userData);
    console.log(res);
    preloaderOff();
    getProfile(3);
    runRoll();
});

logOut.addEventListener('click', async function() {
    if (await authClient.isAuthenticated()) {
        authClient.logout();
    }
});

setTimeout(() => {
    fadeOut(hi, 10)
}, 2000);
// }, 1);

setTimeout(() => {
    runRoll();
}, 3000);
// }, 1);

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

async function runRollBack() {
    preloaderOn();
    let res = await tin.read();
    preloaderOff();
    console.log(res);
    offset -= 375;
    roll.style.transform = 'translateX(-'+ offset +'px)';
}

function runRoll() {
    offset += 375;
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

let imgId = 1;
function onFileSelected(event) {

    let selectedFile = event.target.files[0];
    let reader = new FileReader();
  
    
    reader.readAsDataURL(selectedFile);

    reader.onload = function(event) {

            let boxWrapper = document.querySelector('.selectPhotos');
            let newBox = `
            <div class="photoBox">
                <img class="user" src="${event.target.result}" imgId="${imgId}" alt="">
            </div>
            `;
            boxWrapper.innerHTML += newBox;
            preloaderOn();
            
            
            setTimeout(() => {
                let img = document.querySelector('img.user[imgId="' + imgId + '"]');
                
                const canvas = document.createElement('canvas');
                const width = 375;
                const scaleFactor = width / img.width;
        
        
                canvas.width = width;
                canvas.height = img.height * scaleFactor;
                // canvas.height = 320;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
                // img.src="";
                ctx.canvas.toBlob((blob) => {
                    img.src="";
        
                    let rea = new FileReader();
                    rea.readAsDataURL(blob);
        
                    rea.onloadend = function() {
                        let basee = rea.result;
                        img.src = basee;
                        preloaderOff();
                        imgId += 1;
                        console.log(basee)
                    }
        
                }, 'image/jpeg', 0.5);
                
            }, 800);

    };
}





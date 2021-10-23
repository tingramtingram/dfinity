import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
let authClient;
const init = async () => {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
        console.log('авторизован');
    } else {
        console.log('не авторизован');
    }
  
    variantDfinity.onclick = async () => {
      await authClient.login({
        onSuccess: async () => {
          handleAuthenticated(authClient);
          console.log('успешно вошли и переходим к заполнению профиля');
        },
      });
    };
  };



  setInterval(async () => {
    if (await authClient.isAuthenticated()) {
        console.log('сейчас авторизованы');
        console.log(authClient);
    } else {
        console.log('сейчас не авторизованы');
        console.log(authClient);
    }
  }, 1000);




  async function handleAuthenticated(authClient) {
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity }); 

}
init();








let hi = document.querySelector('section.hi');
let readme = document.querySelector('section.readme');
let tabsButtons = document.querySelectorAll('button.tabs');
let roll = document.querySelector('.roll');
let paginationDots = document.querySelectorAll('section.readme .count_slide .dot');
let goLoginButton = document.querySelector('.goLogin');
let imgEye = document.querySelector('.global_input img.modify');
let backButtons = document.querySelectorAll('.backButton');
let buttonContinue = document.querySelectorAll('.global_continue button.continue');
let uploadTabs = document.querySelectorAll('.uploadTab');
let variantDfinity = document.querySelector('.variant.dfinity');


setTimeout(() => {
    fadeOut(hi, 10)
}, 2000);
// }, 2);

setTimeout(() => {
    runRoll();
    // runRoll();
    // runRoll();
    // runRoll();
    // runRoll();
    // runRoll();
}, 3000);
// }, 10);

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
    if (activeDot) {activeDot.classList.add('active'); }
    
}

imgEye.addEventListener('click', function() {
    let sosedInput = document.querySelector('.login_password');
    let attr = sosedInput.getAttribute('type');
    if (attr == 'password') {sosedInput.setAttribute('type','text')} else {sosedInput.setAttribute('type','password')}
});

backButtons.forEach((el) => {
    el.addEventListener('click', async function() {
        runRollBack();
        if (await authClient.isAuthenticated()) {
            authClient.logout();
        }
    });
});


buttonContinue.forEach((el) => {
    el.addEventListener('click', function() {
        runRoll();
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



function onFileSelected(event) {
;
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
  
    // var imgtag = document.getElementById("myimage");
    // imgtag.title = selectedFile.name;
  
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








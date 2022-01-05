
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
// import { tin } from "../../declarations/tin";
import { tin, canisterId, createActor } from "../../declarations/tin";
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
let actor;
let identity;

const init = async () => {
    preloaderOn();
    authClient = await AuthClient.create();

    if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
        
        tabReadme.forEach((el) => {
            el.remove();
        });
    } else {
        preloaderOff();
    }
    
    
    variantDfinity.onclick = async () => {
        preloaderOn();
      await authClient.login({
        onSuccess: async () => {
            runRoll();
          handleAuthenticated(authClient);
          preloaderOff();
          console.log('login succes');
        },
      });
    };
  };

  async function handleAuthenticated(authClient) {
    
    identity = await authClient.getIdentity();

    actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      who = await actor.whoami();
      console.log(who.toString());

      preloaderOff();
      getProfile(1, who);
    }
init();
let who;






function preloaderOn() {
    preloader.classList.add('active');
};

function preloaderOff() {
    preloader.classList.remove('active');
};



gear.addEventListener('click', async function() {

    let settingsModal = document.querySelector('.settings_modal');
    let logOutBtn = settingsModal.querySelector('.logout');
    let deleteBtn = settingsModal.querySelector('.delete');
    if (settingsModal.classList.contains('active')) {
        settingsModal.classList.remove('active');
    } else {
        settingsModal.classList.add('active');
    }
    logOutBtn.addEventListener('click', async function() {
        if (await authClient.isAuthenticated()) {
            authClient.logout();
            location.reload();
        }
    });
    deleteBtn.addEventListener('click', async function() {
        preloaderOn();
        messageForHeart('Delete your account');
        let res = await actor.delete();
        preloaderOff();
        location.reload();
    });

    // console.log(res);
    // location.reload();
});

function messageForHeart(message) {
    let spanHeart = document.querySelector('.preloader span');
    spanHeart.innerHTML = message;
};

async function getProfile(rollBacks, principal) {
    preloaderOn();
    messageForHeart('Get your profile');
    let res = await actor.read();
    console.log('полученый профиль:');
    console.log(res)
    if (res == null || res == "" || res == undefined) {
        console.log('Профиль не создан');
        preloaderOff();
    }


    // RENDER PRINCIPAL 
    messageForHeart('Get your Principal Id');
    let principalString = principal.toString();
    let lastPrincipal = principalString.slice(-3);
    let firstPrincipal = principalString.substring(0, 5);
    let miniPrincipal = firstPrincipal + "..." + lastPrincipal;

    if (res.length > 0) {
        let principalP = document.querySelector('.principal p');
        if (principal !== null) {
            principalP.setAttribute('full', principalString);
            principalP.innerHTML = miniPrincipal;
            let principalItem = document.querySelector('.principal');
            principalItem.addEventListener('click', function() {
                let full = principalP.getAttribute('full');
                console.log(full);
                navigator.clipboard.writeText(full);
            });
            
        }
        // END RENDER PRINCIPAL

        paginationWrapper.remove();
        messageForHeart('Deploy your data on page');
        // RENDER NAME, BIRTH and PHOTOS 
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

        // END RENDER NAME, BIRTH and PHOTOS 
        messageForHeart('Get your video ids');

        let getVideoIds = res[0].userData.profileVideoIds;
        // convert big int to number 
        let numbersResult = [];
        for(let i = 0; i < getVideoIds.length; i++) {
            numbersResult.push(Number(getVideoIds[i]));
        };
        //
        console.log(numbersResult);
        localStorage.setItem('profileVideoIds', JSON.stringify(numbersResult));
        console.log('НОМЕРА НАШИХ ВИДЕО: ' + JSON.parse(localStorage.getItem('profileVideoIds')));

        messageForHeart('Get your quantity videos');
        // УЗНАЕМ СКОЛЬКО ВИДЕО У НАС ЗАГРУЖЕНО 

        console.log('Количество наших видео:' + getVideoIds.length)
        // отображаем боксы видосов на странице 
        for(let j = 0; j < getVideoIds.length; j++) {
            let videoItem = `
            <div class="child video" videoId="${getVideoIds[j]}" base64="">
                <img src="img/play.jpg" alt="">
                <div class="loading">
                    <div class="loading_line_wrapper">
                    <div class="loading_line">
                        <div class="loading_line_inner loading_line_inner--1"></div>
                        <div class="loading_line_inner loading_line_inner--2"></div>
                    </div>
                    </div>
                </div>
            </div>
            `;
            profilePhotosWrap.innerHTML += videoItem;
        };
        addEventListenersProfileVideos();
        

        preloaderOff();


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


function addEventListenersProfileVideos() {
    let allVideoItems = document.querySelectorAll('.selectPhotosWrap .child.video');
    allVideoItems.forEach((el) => {
        el.addEventListener('click', function() {
            if (this.getAttribute('base64') == "") {
                let videoId = String(this.getAttribute('videoid'));
                let loadingItem = this.querySelector('.loading');
                loadingItem.classList.add('active');
                getFullVideoBase64(videoId, this, loadingItem);
            } else {
                let base64code = this.getAttribute('base64');
                let videoHtmlItem = `
                <video id="video" width="370" controls>
                    <source src="${base64code}">
                </video>
                `;
                let videoModal = document.querySelector('.videoModal');
                let videoModalWrap = document.querySelector('.videoModal .videoModalWrap');
                videoModalWrap.innerHTML = videoHtmlItem;
                videoModal.classList.add('active');
            }

        });
    });
};

async function getFullVideoBase64(stringVideoId, videoItem, preloader) {

    // получаем видео 
    // let chunkId = 0;
    console.log('начинаем загрузку видео из мотоко');
    let chunksFront = [];
    // getCh();
    
    for(let i = 0; i < 14; i++) {
        let resultChunkId = stringVideoId + String(i);
        // let chunk = await actor.getChunk(Number(resultChunkId));
        chunksFront.push(actor.getChunk(Number(resultChunkId)));
    };
    console.log("MASSIVE С ОБЕЩАНИЯММИ:" + chunksFront);

    const responses = await Promise.all(chunksFront).then((data) => {
        preloader.classList.remove('active');
        console.log('мы получили все обещания');
        console.log(data);
        console.log(typeof data);
        let base64code = data.join('');
        videoItem.setAttribute('base64', base64code);
        let videoHtmlItem = `
        <video id="video" width="370" controls>
            <source src="${base64code}">
        </video>
        `;
        let videoModal = document.querySelector('.videoModal');
        let videoModalWrap = document.querySelector('.videoModal .videoModalWrap');
        videoModalWrap.innerHTML = videoHtmlItem;
        videoModal.classList.add('active');
    });
};

// прослушка крестика модалки с видео 
let videoModalWindow = document.querySelector('.videoModal');
let closeVideo = document.querySelector('.videoModal > img');
closeVideo.addEventListener('click', function() {
    let videoTag = document.querySelector('.videoModalWrap video');
    videoTag.remove();
    if (videoModalWindow.classList.contains('active')) {
        videoModalWindow.classList.remove('active');
    }
});

let videosBase64Array = [];
let videoChunks = [];
let nowLoadedVideoNumber = 0;


let videoIds = [];
createUser.addEventListener('click', async function() {
    let photos = document.querySelectorAll('.selectPhotos .photoBox.img');
    let photosArray = [];
    photos.forEach((el) => {
        photosArray.push([el.querySelector('img').src]);
    });
    if (photosArray.length == 0) {
        alert('Нужно загрузить хотя бы одно фото!');
    } else {
        preloaderOn();
        let name = newName.value;
        let birthDate = newBirthDate.value;
        
        // узнаем сколько мы хотим загрузить видео, и создаем сколько нужно айдишников для видосов
        for(let i = 0; i < videosBase64Array.length; i++) {
            let randomId = randomInteger(100, 99999);
            videoIds.push(randomId);
        };
        localStorage.setItem('profileVideoIds', JSON.stringify(videoIds));
        
        console.log('VideoIds которые запушим в мотоко');
        console.log(videoIds)
    
        let userData = {
            userData : {
                dateOfBirth : [birthDate],
                name : [name],
                profilePhotos : photosArray,
                profileVideoIds : videoIds
            }
        };
        messageForHeart('Create new User');



        // set videoIds
            // состовляем массив из массивов с чанками всех загруженых видео (после загрузки юзером они хранятся в videoBase64Array)
        for(let i = 0; i < videosBase64Array.length; i++) {
            let chunkArray = videosBase64Array[i].match(/.{1,1800000}/g);
            videoChunks.push(chunkArray);
        };
        console.log(videoChunks);


        await actor.create(userData);
        
        
        // LOAD VIDEOS TO MOTOKO
        // load first video on motoko chunks 
        if (videoChunks.length !== 0) {
            messageForHeart('Send your videos to server');
            loadVideosInMotoko();
        } else {
            preloaderOff();
            getProfile(3, who);
            runRoll();
        }
        
        async function loadVideosInMotoko() {
            switch(true) {
                case nowLoadedVideoNumber == 0 : messageForHeart('Send your first video to server');break;
                case nowLoadedVideoNumber == 1 : messageForHeart('Send your second video to server');break;
                case nowLoadedVideoNumber == 2 : messageForHeart('Send your third video to server');break;
                case nowLoadedVideoNumber == 3 : messageForHeart('Send your four video to server');break;
                case nowLoadedVideoNumber == 4 : messageForHeart('Send your five video to server');break;
            }
            let chunkId = 0;                   
            let videoId = JSON.parse(localStorage.getItem('profileVideoIds'))[nowLoadedVideoNumber];    // первый номер видео в профиле
            let chunksValue = videoChunks[nowLoadedVideoNumber].length;    // общее количество чанков в первом видео
            let resultIds = [];                 // в цикле ниже получаем скреплёные айдишники для хранения чанков (айди видео + номер чанка)
            for(let i = 0; i < chunksValue; i++) {
                let resultId = String(videoId) + String(chunkId);
                chunkId += 1;
                console.log('result chunk id:' + resultId);
                resultIds.push(Number(resultId));
            };
            console.log('Список готовых номеров для чанков одного видео:' + resultIds);
            console.log('Количество чанков для одного видео:' + videoChunks[nowLoadedVideoNumber].length);
            // load chunks on backend
            console.log('начинаем загрузку чанков');
            // let chunkNum = 0;

            let promiseArray = [];
            new Promise(async (resolve, reject) => {
                for(let i = 0; i < resultIds.length + 1; i++) {

                    if (resultIds[i] !== null && resultIds[i] !== undefined) {
                        promiseArray.push(actor.setChunk(resultIds[i], videoChunks[nowLoadedVideoNumber][i]));
                        // let loadChunk = await actor.setChunk(resultIds[i], videoChunks[nowLoadedVideoNumber][i]);
                        // console.log(loadChunk);
                    } else {
                        console.log('Все чанки видео номер:' + nowLoadedVideoNumber + 'загружены в обещание');
                        nowLoadedVideoNumber += 1;
                        const responses = await Promise.all(promiseArray).then((data) => {
                            console.log('мы получили все обещания, видео номер ' + nowLoadedVideoNumber + 'загружено');
                            console.log(data);
                            console.log(typeof data);
                            resolve();

                        });
                        
                        
                    }
                };
            }).then(() => {
                console.log('зашли в зен');
                console.log('НОМЕР СЛЕДУЮЩЕГО ЗАГРУЖАЕМОГО ВИДЕО:' + nowLoadedVideoNumber);
                console.log('СКОЛЬКО ВСЕГО ВИДОСОВ НУЖНО ЗАГРУЗИТЬ:' + videoChunks.length);
                if (nowLoadedVideoNumber < videoChunks.length) {
                    console.log('идем на круг');
                    loadVideosInMotoko();

                } else {
                    console.log('перешли на конец');
                    nowLoadedVideoNumber = 0;
                    preloaderOff();
                    getProfile(3, who);
                    runRoll();
                }
            });
        };

    }

});





function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

logOut.addEventListener('click', async function() {
    if (await authClient.isAuthenticated()) {
        authClient.logout();
    }
});

setTimeout(() => {
    fadeOut(hi, 10)
}, 800);
// }, 1);

setTimeout(() => {
    runRoll();
}, 1000);
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
    let res = await actor.read();
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
let proverkaVesa = [];
function onFileSelected(event) {

    let selectedFile = event.target.files[0];
    let reader = new FileReader();
  
    
    reader.readAsDataURL(selectedFile);

    reader.onload = function(event) {
        let boxWrapper = document.querySelector('.selectPhotos');
            if (event.target.result.startsWith('data:video')) {
                console.log('Это видео')
                console.log(event);
                let base64video = event.target.result;

                let chunkArray = base64video.match(/.{1,1800000}/g);
                proverkaVesa.push(chunkArray);
                // if (proverkaVesa[0].length > 12) {
                //     alert('The downloadable video exceeds 21 megabytes');
                // } else {
                    videosBase64Array.push(base64video);

                    let newBox = `
                    <div class="photoBox video">
                        <img class="" src="img/play.jpg" alt="">
                    </div>
                    `;
                    boxWrapper.innerHTML += newBox;
                // }

            } else {
                
                let newBox = `
                <div class="photoBox img">
                    <img class="user" src="${event.target.result}" imgId="${imgId}" alt="">
                </div>
                `;
                boxWrapper.innerHTML += newBox;
                preloaderOn();
                messageForHeart('Load photo');
                
                
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
            }


        

    };
}





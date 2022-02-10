
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
// import { tin } from "../../declarations/tin";
import { tin, canisterId, createActor } from "../../declarations/tin";
import { setUncaughtExceptionCaptureCallback } from "process";



let preloader          = document.querySelector('.loader');
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
let interestLoginBlock = document.querySelector('.interestLoginBlock'); 
let newNameInput       = document.querySelector('.newName');
let newDateInput       = document.querySelector('.newDate');
let logOut             = document.querySelector('.logOut');
let gear               = document.querySelector('.gear');
let tabReadme          = document.querySelectorAll('.tab.readme');
let uploadImputs       = document.querySelectorAll('.photo_matrix input');
let createUser         = document.querySelector('.createUser');
let newName            = document.querySelector('input.newName');
let newBirthDate       = document.querySelector('input.newDate');
let ifProfile          = document.querySelectorAll('.ifProfile');
let newAbout           = document.querySelector('.global_input input.about');
let genderSpan         = document.querySelector('.ifProfile .chosen-value span');
let genderLoginInput   = document.querySelector('.ifProfile .chosen-value');
let filterByYears = document.querySelectorAll('.value-list.years li');
let filterByGender = document.querySelectorAll('.value-list.gender li');



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
        console.log('пользователь залогинен')
    } else {
        preloaderOff();
        console.log('не залогинен')
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
    preloader.classList.add('loader--active');
};

function preloaderOff() {
    preloader.classList.remove('loader--active');
};



gear.addEventListener('click', async function() {
    console.log('dali proslushku gear')
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
        // получаем список всех наших конвертаций
        let myProf = await actor.read();
        console.log('получили наш профиль')
        console.log('получили массив с номерами наших бесед');
        console.log(myProf[0].userData.conversations);
        // собираем массив с обещаниями 
        let promiseDeleteConvers = [];
        myProf[0].userData.conversations.forEach((el) => {
            promiseDeleteConvers.push(actor.deleteConversation(el[0]));
        });
        let res = await actor.delete();
        console.log('Удалили аккаунт')
        const responses = await Promise.all(promiseDeleteConvers).then((data) => {
            console.log(data);
            console.log('удалили беседы')
            preloaderOff();
            location.reload();
        });



        // удаляем все наши конвертации 
        
        // 
        
        // 
    });

    // console.log(res);
    // location.reload();
});

function messageForHeart(message) {
    let spanHeart = document.querySelector('.loader span');
    spanHeart.innerHTML = message;
};

let myPrincipal = '';
let myProfId = '';
let myPhoto = '';
let myName = '';

let lastViewedProfilePhoto;
let lastViewedProfileName;



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
    myPrincipal = principal.toString();
    let lastPrincipal = principalString.slice(-3);
    let firstPrincipal = principalString.substring(0, 5);
    let miniPrincipal = firstPrincipal + "..." + lastPrincipal;

    if (res.length > 0) {
        myProfId = res[0].userData.profileId;
        myPhoto = res[0].userData.profilePhotos[0];
        myName = res[0].userData.name;
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
        name.innerHTML = res[0].userData.name + ', ';
        // Конвертируем дату в года и выводим в профиль
        let dateNow = Date.parse(new Date());
        let birthDate = Date.parse(res[0].userData.dateOfBirth);
        let resultMs = dateNow - birthDate;
        let resultAge = Math.floor(resultMs / (1000 * 60 * 60 * 24 * 30 * 12));
        dateOfBirth.innerHTML = resultAge;
        // конец вывода даты
        
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
        if (rollBacks == 4) {
            runRollBack();
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
    if (allVideoItems) {
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
    }

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
if (closeVideo) {
    closeVideo.addEventListener('click', function() {
        let videoTag = document.querySelector('.videoModalWrap video');
        videoTag.remove();
        if (videoModalWindow.classList.contains('active')) {
            videoModalWindow.classList.remove('active');
        }
    });
}


let videosBase64Array = [];
let videoChunks = [];
let nowLoadedVideoNumber = 0;

function makeid(count) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < count; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  

let videoIds = [];
createUser.addEventListener('click', async function() {
    let photos = document.querySelectorAll('.selectPhotos .photoBox.img');
    
    let photosArray = [];
    photos.forEach((el) => {
        photosArray.push([el.querySelector('img').src]);
    });
    if (photosArray.length == 0) {
        alert('You need to upload at least one photo!');
    } else {
        preloaderOn();
        let genderElement = document.querySelector('.ifProfile .chosen-value span.active')

        let name = newName.value;
        let gender = '';
        if (genderElement) {gender = genderElement.textContent;}
        let birthDate = newBirthDate.value;
        let profileId = makeid(8);
        let mainThings = [];
        let interests = [];
        let conversations = [];
        let about = newAbout.value;

        let mainThingsActiveElements = document.querySelectorAll('.loginInterestsWrap .loginInterests .interest .tagArea span.mainThings.active');
        let interestsActiveElements = document.querySelectorAll('.loginInterestsWrap .loginInterests .interest.tab.active .zone.active');
        if (mainThingsActiveElements && interestsActiveElements) {
            mainThingsActiveElements.forEach((el) => {
                mainThings.push([el.textContent + el.getAttribute('bg')]);
            });
            interestsActiveElements.forEach((el) => {
                interests.push([el.textContent + el.getAttribute('bg')]);
            });
        }

        console.log('profileID:' + profileId);
        console.log(mainThings);
        console.log(typeof mainThings);
        console.log(typeof mainThings[0]);
        // console.log(interests);


        
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
                profileVideoIds : videoIds,
                profileId : [profileId],
                gender : [gender],
                mainThings : mainThings,
                interests : interests,
                conversations : conversations,
                about : [about],
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
            getProfile(4, who);
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
                    getProfile(4, who);
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

if (logOut) {
    logOut.addEventListener('click', async function() {
        if (await authClient.isAuthenticated()) {
            authClient.logout();
        }
    });
}


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
if (tabsButtons) {
    tabsButtons.forEach((el) => {
        el.addEventListener('click', function() {
            runRoll();
        });
    });
} else {
    console.log('tabs buttons not find')
}


async function runRollBack() {
    preloaderOn();
    let res = await actor.read();
    preloaderOff();
    console.log(res);
    offset -= 375;
    roll.style.transform = 'translateX(-'+ offset +'px)';
}

function rollBack() {
    offset -= 375;
    roll.style.transform = 'translateX(-'+ offset +'px)';
    console.log(offset)
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

// if (imgEye) {
//     imgEye.addEventListener('click', function() {
//         let sosedInput = document.querySelector('.login_password');
//         let attr = sosedInput.getAttribute('type');
//         if (attr == 'password') {sosedInput.setAttribute('type','text')} else {sosedInput.setAttribute('type','password')}
//     });
// } else {
//     console.log('imgEye not find')
// }

if (checkNameDate) {
    checkNameDate.addEventListener('click', function() {
        if (newNameInput.value == "") {
            newNameInput.classList.add('inputError');
            setTimeout(() => {
                newNameInput.classList.remove('inputError');
            }, 2000);
        } else if (genderSpan.textContent == "" || genderSpan.textContent == "Your gender") {
            genderLoginInput.classList.add('inputError');
            setTimeout(() => {
                genderLoginInput.classList.remove('inputError');
            }, 2000);
        } else if (newDateInput.value == "" || newDateInput.value == null && newDateInput.value == undefined) {
            newDateInput.classList.add('inputError');
            setTimeout(() => {
                newDateInput.classList.remove('inputError');
            }, 2000);
        } else {runRoll();}
    });
} else {
    console.log('checkNameData not find')
}


if (uploadPhotos) {
    uploadPhotos.addEventListener('click', function() {
        runRoll();
    });
} else {
    console.log('uploadsPhotos not find');
}

if (interestLoginBlock) {
    interestLoginBlock.addEventListener('click', function() {
        runRoll();
    });
} else {
    console.log('interestLoginBlock not find');
}


backButtons.forEach((el) => {
    el.addEventListener('click', function() {
        runRollBack();
    });
});


// uploadTabs.forEach((el) => {
//     el.addEventListener('click', function() {
//         uploadTabs.forEach((x) => {
//             x.classList.remove('active');
//         });
//         el.classList.add('active');
//     });
// });

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

// login interests 
let mainInterestsTabs = document.querySelectorAll('.interest.main .tag');
let allIntrestsTags = document.querySelectorAll('.loginInterestsWrap .loginInterests .interest .tagArea span.zone');

mainInterestsTabs.forEach((el) => {
    el.addEventListener('click', function() {
        if (!this.classList.contains('active')) {
            this.classList.add('active');
            let tab = this.getAttribute('tab');
            let intrestTab = document.querySelector('.loginInterestsWrap .loginInterests .interest.tab[tab="'+ tab +'"]')
            intrestTab.classList.add('active');
        } else {
            this.classList.remove('active');
            let tab = this.getAttribute('tab');
            let intrestTab = document.querySelector('.loginInterestsWrap .loginInterests .interest.tab[tab="'+ tab +'"]')
            let intrestTabTags = intrestTab.querySelectorAll('span.tag');
            intrestTabTags.forEach((el) => {
              el.classList.remove('active');
            });
            intrestTab.classList.remove('active');
        }
    });
});

allIntrestsTags.forEach((el) => {
    el.addEventListener('click', function() {
        let zone = this.getAttribute('zone');
        // находим все элементы одной зоны и проверяем количество активных если активных меньше трех разрешаем нажать еще
        let activeZoneElements = document.querySelectorAll('.loginInterestsWrap .loginInterests .interest .tagArea span.zone.active[zone="'+ zone +'"]');

        // if (activeZoneElements.length > 2) {
        //     alert('maximum 3 in each category');
        // } else {
            if (!this.classList.contains('active')) {
                // let zoneTags = document.querySelectorAll('.loginInterestsWrap .loginInterests .interest .tagArea span.zone[zone="'+ zone +'"]');
                // zoneTags.forEach((x) => {
                //     x.classList.remove('active');
                // });
                if (activeZoneElements.length > 2) {
                    alert('maximum 3 in each category');
                } else {
                    this.classList.add('active');
                }
                
            } else {
                this.classList.remove('active');
            }
        // }

    });
});

// SELECTS
const inputField = document.querySelectorAll('.selectItem');
const dropdowns = document.querySelectorAll('.value-list');


inputField.forEach((el) => {

  el.addEventListener('click', function(event) {
    event.stopPropagation();
    let dropdown = el.nextElementSibling;
    dropdown.classList.add('open');
  });

});

dropdowns.forEach((el) => {
  el.addEventListener('click', function(event) {
    event.stopPropagation();
  });
  let lis = el.querySelectorAll('li');
  lis.forEach((x) => {
    x.addEventListener('click', function() {
      let text = this.textContent;
      let mainValue = this.parentElement.previousElementSibling.querySelector('span');
      let dropDown = this.parentElement;
      dropDown.classList.remove('open');
      mainValue.innerText = text;
      mainValue.classList.add('active');
    });
  });
});

document.addEventListener('click', function() {
  dropdowns.forEach((el) => {
    el.classList.remove('open');
  });
});


// FILTER
let filterBtn = document.querySelector('.tab.allUsers .firs_logo .gear');
let filterModal = document.querySelector('.tab.allUsers .settings_modal');
filterBtn.addEventListener('click', function() {
  if (!filterModal.classList.contains('active')) {
    filterModal.classList.add('active');
  } else {
    filterModal.classList.remove('active');
  }
});
// dropdown.forEach((el) => {
//   const dropdownArray = el.querySelectorAll('li');
//   let valueArray = [];
//   dropdownArray.forEach(item => {
//     valueArray.push(item.textContent);
//   });
// }); 


// inputField.forEach((el) => {
//   el.focus(); // Demo purposes only
// });


// const closeDropdown = () => {
//   dropdown.classList.remove('open');
// };

// inputField.forEach((el) => {

//   el.addEventListener('mouseup', () => {
//     dropdown.forEach((el) => {
//       el.classList.add('open');
//     }); 
//     let inputValue = el.value.toLowerCase();

//     if (inputValue.length > 0) {
//       for (let j = 0; j < valueArray.length; j++) {
//         if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
//           dropdownArray[j].classList.add('closed');
//         } else {
//           dropdownArray[j].classList.remove('closed');
//         }
//       }
//     } else {
//       for (let i = 0; i < dropdownArray.length; i++) {
//         dropdownArray[i].classList.remove('closed');
//       }
//     }
//   });

//   el.addEventListener('mouseup', () => {
//     el.placeholder = 'Your gender';
//     dropdown.forEach((el) => {
//       el.classList.add('open');
//     }); 
//     dropdownArray.forEach(dropdown => {
//       dropdown.forEach((el) => {
//         el.classList.remove('closed');
//       }); 
//     });
//   });

//   el.addEventListener('blur', () => {
//     el.placeholder = 'Select state';
//     dropdown.forEach((el) => {
//       el.classList.remove('open');
//     }); 
//   });
// });



// dropdownArray.forEach(item => {
//   item.addEventListener('mouseup', evt => {
//     inputField.value = item.textContent;
//     dropdownArray.forEach(dropdown => {
//       dropdown.forEach((el) => {
//         el.classList.add('closed');
//       }); 
//     });
//   });
// });





// "13:45 PM".substr(0, 5) - вырезать 5 символов начиная с первого 






////////// MAIN PANEL 

let allPanelBtns = document.querySelectorAll('.mainPanelItem');
if (allPanelBtns) {

    allPanelBtns.forEach((el) => {
        el.addEventListener('click', function() {
            if (this.classList.contains('map') && this.classList.contains('main')) {runRoll(); getAllUsers(); offMessagesInterval()}
            if (this.classList.contains('chat') && this.classList.contains('main')) {runRoll();runRoll(); getAllConversatioons(); offMessagesInterval()}
            // if (this.classList.contains('poker') && this.classList.contains('main')) {runRoll(); getAllUsers(); offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('main')) {}

            if (this.classList.contains('map') && this.classList.contains('users')) {}
            if (this.classList.contains('chat') && this.classList.contains('users')) {runRoll(); getAllConversatioons();}
            // if (this.classList.contains('poker') && this.classList.contains('users')) {}
            if (this.classList.contains('profile') && this.classList.contains('users')) {rollBack();}


            if (this.classList.contains('map') && this.classList.contains('conversations')) {rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('chat') && this.classList.contains('conversations')) {offMessagesInterval()}
            // if (this.classList.contains('poker') && this.classList.contains('conversations')) {rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('conversations')) {rollBack();rollBack();offMessagesInterval()}


            if (this.classList.contains('map') && this.classList.contains('chatWindow')) {rollBack();rollBack(); getAllUsers(); offMessagesInterval()}
            if (this.classList.contains('chat') && this.classList.contains('chatWindow')) {}
            // if (this.classList.contains('poker') && this.classList.contains('chatWindow')) {rollBack();rollBack(); getAllUsers(); offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('chatWindow')) {rollBack();rollBack();rollBack(); offMessagesInterval()}



            if (this.classList.contains('map') && this.classList.contains('otherUser')) {rollBack();rollBack();rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('chat') && this.classList.contains('otherUser')) {rollBack();rollBack(); getAllUsers();offMessagesInterval()}
            // if (this.classList.contains('poker') && this.classList.contains('otherUser')) {rollBack();rollBack();rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('otherUser')) {rollBack();rollBack();rollBack();rollBack();offMessagesInterval()}

        });
    });

}

//////// OFF MESAGES INTERVAL 
let messagesInterval;
function offMessagesInterval() {

    clearInterval(messagesInterval);
    
   
};

/////////// GET ALL CONVERSATIONS 
async function getAllConversatioons() {
    preloaderOn();
    messageForHeart('Get your conversations');
    let res = await actor.read();
    console.log(res[0].userData.conversations)



    if (res[0].userData.conversations.length !== 0) {
        let sorted = [];
        // сортировка на повторку
        for(let i = 0; i < res[0].userData.conversations.length; i++) {
            if (!sorted.includes(res[0].userData.conversations[i][0])) {
                sorted.push(res[0].userData.conversations[i][0]);
            }
        };
        console.log(sorted);
        // перебор отсартированного массива с номерами конвертаций
        let conversationPromises = [];
        for(let i = 0; i < sorted.length; i++) {
            conversationPromises.push(actor.getConversation(sorted[i]));
        };
        console.log(conversationPromises)
            const responses = await Promise.all(conversationPromises).then((data) => {
                console.log(data);
                let conversationsResult = [];
                for(let i = 0; i < sorted.length; i++) {
                    conversationsResult.push([sorted[i], data[i]]);
                };
                renderConversations(conversationsResult);
                
                // массив объектов конвертаций и массив номеров конвертаций в том же порядке 
            });
    
    } else {
        preloaderOff();
    }

    




};

// счетчик полных конверсаций которые будут выведены на страницу
// пустые и удаленных аккаунтов не в счет 
let countFullConversations;
async function renderConversations(conversationsArr) {
    countFullConversations = 0;
    let conversationsWrap = document.querySelector('.chatHistoryWrap .chatHistory');
    conversationsWrap.innerHTML = "";
    let convIds = [];


    console.log('все конверсации')
    console.log(conversationsArr)
    conversationsArr.forEach(async (el) => {
        if (el[1].length > 0 && el[1][0].length > 1 ) {
            countFullConversations += 1;
            preloaderOn();
            //
            convIds.push(el[0]);
            //
            console.log('получили список айдишников конвертаци и записали в convIds')
            // перебираем каждое сообщение конвертации с конца и ищем последнее сообщение не с наишм principalId
            let opanentPrincipal;
            el[1].forEach((x) => {
                // let lastMessagePrincipal = el[1][0][el[0].length - 1].userPrincipalText;
     
                for(let i = x.length - 1; i > -1; i--) {
                    console.log(x[i]);
                    console.log(myPrincipal)
                    console.log(x[i].userPrincipalText[0])

                    if (x[i].userPrincipalText[0] !== myPrincipal && x[i].userPrincipalText[0] !== '99999999') {
                        console.log('ОТЛИЧАЮЩИЙСЯ ПРИНЦИПАЛ')
                        console.log('принципал опанента')
                        opanentPrincipal = x[i].userPrincipalText[0];
                        continue;
                    }
        
                };
            });
            // получаем дату опанента и выводим фото и имя 
            let conversationPhoto;
            let conversationName;
            console.log('ТУТ МЫ ПОЛУЧИЛИ ПРИНЦИПАЛ ОПАНЕНТА ');
            console.log(opanentPrincipal)
            if (opanentPrincipal !== undefined && opanentPrincipal !== null) {
                let data = await actor.getUser(opanentPrincipal);
                console.log(data[0].userData)
                conversationPhoto = data[0].userData.profilePhotos[0];
                conversationName = data[0].userData.name;
                console.log('опанент найден выводим его информацию ')
            }
            // } else {
            //     console.log('опанента нет в переписке и выводим свою информацию');
            //     conversationPhoto = myPhoto[0];
            //     conversationName = myName[0];
            // }


            let lastMessageText = el[1][0][el[1][0].length - 1].text;
            

            let conversationItem = `
                <div class="historyUser" conversationId="${el[0]}" opanentPrincipal="${opanentPrincipal}">
                    <div class="photo">
                        <img src="${conversationPhoto}" alt="">
                    </div>
                    <div class="info">
                        <p>${conversationName}</p>
                        <span>${lastMessageText}</span>
                    </div>
                    <span class="time"></span>
                </div>
            `;


            
            conversationsWrap.innerHTML += conversationItem;
            // тут сразу же вещаем на айтем прослушку не дожидаясь остальных 
            let thisConversationItem = document.querySelectorAll('.chatHistoryWrap .chatHistory .historyUser');

            if (countFullConversations  == thisConversationItem.length) {
                thisConversationItem.forEach((xx) => {
                    xx.addEventListener('click', async function() {
                        preloaderOn();
                        messageForHeart("Search chat");
                        console.log('нажали на конвертацию');
                        let conversationId = this.getAttribute('conversationId');
                        let opanentPrincipal = this.getAttribute('opanentPrincipal');
                        let upUserBlock = document.querySelector('.opponent');
                        upUserBlock.setAttribute('principal', opanentPrincipal)
                        console.log('получили объект конверсации')
                        runRoll();
                        console.log('крутанули ролл')
                        let conversationObject = await actor.getConversation(conversationId);
                        if (conversationObject.length == 0) {
                            alert('user deleted his page')
                            preloaderOff();
                            rollBack();
                        } else {
                            let opanentData = await actor.getUser(opanentPrincipal);
                            console.log('рендерим сообщения')
                            console.log('НАШЛИ ДАННЫЕ ОПАНЕНТА ')
                            console.log(opanentData[0].userData)
                            
                            renderMessages(conversationId, conversationObject, opanentData[0].userData);
                        }

                    });
                });
                preloaderOff();
            }
   


            preloaderOff();
        } else {
            preloaderOff();
            
        }
    });
    // ПОСЛЕ ОТРИСОВКИ ВСЕХ КОНВЕРТАЦИЙ ДАЕМ ПРОСЛУШКУ КАЖДОЙ КОНВЕРТАЦИИ 


    let conversationItems = document.querySelectorAll('.chatHistoryWrap .chatHistory .historyUser');
    conversationItems.forEach((el) => {
        el.addEventListener('click', async function() {
  
            
        });
    });






    console.log(conversationsArr);
    // получим профиль опанентов 
    // берем все полученые id конвертаций удаляем из них наш номер и получаем чистый номер опанента 
    let opanentIds = [];
    convIds.forEach((el) => {
        let newString = el.replace(myProfId, '');
        opanentIds.push(newString);
    });
    // получили чистые айдишники опанентов начинаем тянуть их данные 
    let getOpanentsData = [];
    for(let i = 0; i < opanentIds.length; i++) {
        getOpanentsData.push(actor.getConversation(opanentIds[i]));
    };

    const responses = await Promise.all(getOpanentsData).then((data) => {
        console.log(data);
    });
    
    // console.log(opanentIds);





};




////////// GET ALL USERS


async function getAllUsers() {
    preloaderOn();
    messageForHeart('Get all users');
    let result = await actor.allUsers();
    console.log(result);
    renderAllUsers(result);
};


let yearsFilter = [1,10000];
let genderFilter = 'All';

let forFilterAllUsers = [];
function renderAllUsers(result) {
    forFilterAllUsers = [];
    // сразу же перебираем результаты согласно фильтру и отдаем в фор фильтер 
    result.forEach((el) => {
        let genderStatus = false;
        let yearsStatus = false;

        // рендер без выставленных фильтров
        if (yearsFilter == [1,10000] && genderFilter == 'All') {
            forFilterAllUsers.push(el);
        }

        let userDataObject = el[1].userData;
        let dateOfBirth = userDataObject.dateOfBirth[0];
        // переводим дату юзера в года 
        let dateNow = Date.parse(new Date());
        let birthDate = Date.parse(dateOfBirth);
        let resultMs = dateNow - birthDate;
        let resultAge = Math.floor(resultMs / (1000 * 60 * 60 * 24 * 30 * 12));

        let age = resultAge;
        let gender = userDataObject.gender[0];

        
        if (Number(age) >= Number(yearsFilter[0]) && Number(age) <= Number(yearsFilter[1])) {
            yearsStatus = true;
        }
        

        if (genderFilter == 'All') {
            genderStatus = true;
        } else {
            if (gender == genderFilter) {
                genderStatus = true;
            }
        }

        if (genderStatus == true && yearsStatus == true) {
            forFilterAllUsers.push(el);
        };
         

    });
    // forFilterAllUsers = result;

    preloaderOff();
    let allUsersWrap = document.querySelector('.allUsersWrap .allUsers');
    allUsersWrap.innerHTML = "";
    forFilterAllUsers.forEach((el) => {
        // Конвертируем дату в года и выводим в профиль
        let dateNow = Date.parse(new Date());
        let birthDate = Date.parse(el[1].userData.dateOfBirth);
        let resultMs = dateNow - birthDate;
        let resultAge = Math.floor(resultMs / (1000 * 60 * 60 * 24 * 30 * 12));

        // конец вывода даты
        let userItem = `
        <div class="user" principal="${el[1].id.toString()}">
        
            <div class="userPhoto">
                <img src="${el[1].userData.profilePhotos[0]}" alt="">
            </div>
            <div class="userInfo">
                <p>${el[1].userData.name}</p>
                <span>${resultAge}</span>
            </div>
        </div>
        `;

        if (el[1].id.toString() !== myPrincipal) {
            allUsersWrap.innerHTML += userItem;
        }
        
    });
    let allUserItems = document.querySelectorAll('.allUsersWrap .allUsers .user');
    allUserItems.forEach((el) => {
        el.addEventListener('click', function() {
            let principal = this.getAttribute('principal');
            openUserProfile(principal);
        });
    });

};



filterByGender.forEach((el) => {
    el.addEventListener('click', function() {
        let vale = this.getAttribute('data');
            genderFilter = vale;
            let modal = document.querySelector('.tab.allUsers .settings_modal.active');
            modal.classList.remove('active');
            getAllUsers();
    });
});

filterByYears.forEach((el) => {
    el.addEventListener('click', function() {
        let vale = this.getAttribute('data');
        let twoValues = vale.split('-');
        yearsFilter = twoValues;
        let modal = document.querySelector('.tab.allUsers .settings_modal.active');
        modal.classList.remove('active');
            getAllUsers()
        
    });
});








async function openUserProfile(principalString, runRolls) {
    preloaderOn();
    messageForHeart('Download user profile');
    let user = await actor.getUser(principalString);
    console.log(user);
    if (runRolls == null) {
        runRoll();
        runRoll();
        runRoll();
    }
    if (runRolls == 1) {
        runRoll();
    }

    renderUserProfile(user[0].userData, user[0].id);
}



function renderUserProfile(userData, principal) {
    let photo = document.querySelector('.userAreaWrap .userArea .photo img');
    let tagAreaMain = document.querySelector('.userAreaWrap .userArea .interest .tagArea.main');
    let tagAreaInterests = document.querySelector('.userAreaWrap .userArea .interest .tagArea.interests');
    let sendMessage = document.querySelector('.userAreaWrap .photo button.tabBtn');
    let aboutBlock = document.querySelector('.userAreaWrap .userArea .about');
    let aboutProfile = document.querySelector('.userAreaWrap .userArea .about p');
    let mainName = document.querySelector('.mainName');
    
    sendMessage.setAttribute('profilePrincipal', principal.toText());
    sendMessage.setAttribute('profileId', userData.profileId);

    let mainThings = userData.mainThings;
    let interests = userData.interests;
    console.log(mainThings)
    console.log(interests)
    console.log('ТАК ВЫГЛЯДИТ АБАУТ');
    console.log(userData.about)
    if (userData.about.length == 0) {
        aboutBlock.style.display = "none";
    } else {
        aboutBlock.style.display = "block";
        aboutProfile.innerText = userData.about;
    }
    
    mainName.innerText = userData.name;
    photo.src = userData.profilePhotos[0];
    lastViewedProfilePhoto = userData.profilePhotos[0];
    lastViewedProfileName = userData.name;
    



    tagAreaMain.innerHTML = "";
    for(let i = 0; i < mainThings.length; i++) {
        let data = mainThings[i][0].split('#');
        let mainTag = `
            <span style="background-color: #${data[1]};" class="tag">${data[0]}</span>
        `;
        tagAreaMain.innerHTML += mainTag;
    };
    tagAreaInterests.innerHTML = "";
  
    for(let i = 0; i < interests.length; i++) {
        let data = interests[i][0].split('#');
        let interestsTag = `
            <span style="background-color: #${data[1]};" class="tag">${data[0]}</span>
        `;
        tagAreaInterests.innerHTML += interestsTag;

    };

    preloaderOff();
};




//////////////// CREATE CONVERSATION 

let sendMsgButton = document.querySelector('.userAreaWrap .photo button.tabBtn');
sendMsgButton.addEventListener('click', function(e) {
    preloaderOn();
    messageForHeart('Create chat');
    e.stopPropagation();
    let opanentPrincipal = this.getAttribute('profilePrincipal');
    let opanentId = this.getAttribute('profileId');
    let yourPrincipal = myPrincipal;
    
    console.log(opanentPrincipal);
    console.log(yourPrincipal);


    console.log('profile id opanent: ' + opanentId);
    console.log('profile id my: ' + myProfId);
    // let conversationId = opanentId + yourId;
    let conversationId =  myProfId + opanentId;
    let reverseConversation = opanentId + myProfId;
    console.log(conversationId);
    // let conversationId = makeid(12);
    // console.log(conversationId);
    rollBack();
    messageArea(conversationId, reverseConversation, yourPrincipal, opanentPrincipal);

});


async function messageArea(conversationId, reverseConversation, myId, userId) {
    let messagesBox = document.querySelector('.messagesWrap .messages');
    let upUserBlock = document.querySelector('.opponent');
    upUserBlock.setAttribute('principal', userId);
    // let send = document.querySelector('form.textarea button');
    messagesBox.innerHTML = "";
    // send.setAttribute('profileId', myProfId);
    // проверяем существует ли данная конвертация
    let ifConv = await actor.getConversation(conversationId);
    let ifReverseConv = await actor.getConversation(reverseConversation);
    console.log(ifConv);
    if (ifConv.length < 1 && ifReverseConv < 1) {
        console.log('создаем конвертацию');
        // получаем оба профиля для записи новой конвертации 
        let my = await actor.getUser(myId);
        let your = await actor.getUser(userId);
        // let promiseArr = [actor.getUser(myId), actor.getUser(userId)];

        // const responses = await Promise.all(promiseArr).then((data) => {
        //     console.log(data);
        // });
        console.log(my[0].userData);
        console.log(your[0].userData);
        // начинаем запись новой конвертации в оба профиля 


        console.log(my[0].userData.conversations);
        console.log(typeof my[0].userData.conversations)

        my[0].userData.conversations.push([conversationId]);
        your[0].userData.conversations.push([conversationId]);


        // console.log(my[0].userData);


        let exportData = [
            {
                userData : my[0].userData
            },
            {
                userData : your[0].userData
            }
        ];
        console.log(exportData)

        let exportArr = [actor.updateUserData(myId, exportData[0]), actor.updateUserData(userId, exportData[1])];
        
        const responses = await Promise.all(exportArr).then((data) => {
            console.log(data);
        });

        // записали номер конвертации в оба профиля теперь создаём конференцию 
        let res = await actor.setConversation(conversationId, [{
            userId : ['99999999'],
            userPrincipalText : [userId],
            messageId: ['0'],
            text : ['Conversation']
        }]);
        console.log(res)


        let conversationObject = await actor.getConversation(conversationId);
        renderMessages(conversationId, conversationObject, 'fromProfile');

    } else {
        console.log('кновертация уже есть грузим сообщения');
        let conversationObject;
        if (ifConv.length < 1) {
            conversationObject = await actor.getConversation(reverseConversation);
            renderMessages(reverseConversation, conversationObject, 'fromProfile');
        } 
        if (ifReverseConv < 1) {
            conversationObject = await actor.getConversation(conversationId);
            renderMessages(conversationId, conversationObject, 'fromProfile');
        }
        console.log(conversationObject);
        
    }
    


};



/////////// LOAD MESSAGES 
let fresh;
let opanentPhotoUrl;
let listenerSendMouse = 0;
let listenerSendEnter = 0;
function renderMessages(conversationId ,conversationObject, opanentProfileData) {

    let messagesWrap = document.querySelector('.messagesWrap .messages');
    let opanentUpName = document.querySelector('.opponent .info p');
    let opanentPhoto = document.querySelector('.opponent .photo img');
    

    // Если перед рендером мы просматривали профиль пользователя тогда используем данные из переменных last view 
    // Если нет получаем пользователя 
    if (opanentProfileData == 'fromProfile') {
        opanentPhoto.src = lastViewedProfilePhoto[0];
        opanentUpName.innerText = lastViewedProfileName;
        opanentPhotoUrl = lastViewedProfilePhoto[0];
    } else {
        console.log('ДАЕМ ДАННЫЕ ОПАНЕНТУ ФОТО И ИМЯ ')
        opanentPhoto.src = opanentProfileData.profilePhotos[0];
        opanentUpName.innerText = opanentProfileData.name;
        opanentPhotoUrl = opanentProfileData.profilePhotos[0];
    }
 

  


    messagesWrap.innerHTML = "";
    console.log('рендерим сообщения');
    console.log(conversationObject[0]);
    
    conversationObject[0].forEach((el) => {
        if (conversationObject[0][0] !== el) {
            let messageItem;
            console.log(myPhoto)
            if (el.userId == myProfId[0]) {
                messageItem = `
                    <div class="message me" messageId="${el.messageId}">
                        <div class="photo">
                            <img src="${myPhoto[0]}" alt="">
                        </div>
                        <div class="text">
                            <p>${el.text}</p>
                        </div>
                    </div>
                `;
            } else {
                messageItem = `
                    <div class="message" messageId="${el.messageId}">
                        <div class="photo">
                            <img src="${opanentPhotoUrl}" alt="">
                        </div>
                        <div class="text">
                            <p>${el.text}</p>
                        </div>
                    </div>
                `;
            }
    
            messagesWrap.innerHTML += messageItem;
            messagesWrap.scrollIntoView(false);
            preloaderOff();
        }
        preloaderOff();
    });
    ///// запускаем цикл подгрузки 
    messagesInterval = setInterval( async () => {
        let fresh = await actor.getConversation(conversationId);
        if (fresh.length !== 0) {
            // собираем все выведенные сообщения и получаем их номера 
            let pageMessagesIds = [];
            let allMessagesItems = document.querySelectorAll('.messagesWrap .messages .message');
            allMessagesItems.forEach((el) => {
                let id = el.getAttribute('messageId');
                pageMessagesIds.push(id);
            });
            console.log('АЙДИШНИКИ ВЫВЕДЕННЫЕ')
            console.log(pageMessagesIds)


            // messagesWrap.innerHTML = "";
        
            fresh[0].forEach((el) => {
                if (el !== fresh[0][0]) {
                    if (!pageMessagesIds.includes(el.messageId[0])) {
                        let messageItem;
                        if (el.userId == myProfId[0]) {
                            messageItem = `
                                <div class="message me" messageId="${el.messageId}">
                                    <div class="photo">
                                        <img src="${myPhoto[0]}" alt="">
                                    </div>
                                    <div class="text">
                                        <p>${el.text}</p>
                                    </div>
                                </div>
                            `;
                        } else {
            
                            messageItem = `
                                <div class="message" messageId="${el.messageId}">
                                    <div class="photo">
                                        <img src="${opanentPhotoUrl}" alt="">
                                    </div>
                                    <div class="text">
                                        <p>${el.text}</p>
                                    </div>
                                </div>
                            `;
               
            
                        }
                
                        messagesWrap.innerHTML += messageItem;
                        messagesWrap.scrollIntoView(false);
                    }

        
                }
         
            });
        } else {
            rollBack();
            getAllConversatioons();
            offMessagesInterval();
        }
   
    } , 2000);

///////// EVENT LISTEN TEXTAREA 

    let textInput = document.querySelector('.tab.chat .textarea input');  
    let send = document.querySelector('.tab.chat .textarea button');
    send.setAttribute('conversationId', conversationId);

    

    if (listenerSendEnter == 0) {
        listenerSendEnter = 1;
        document.addEventListener('keydown', function(event) {
            console.log(event.keyCode)
            if (event.keyCode == 13) {
                // alert('нажали ентер')
                let messageText = textInput.value;
                sendMes(messageText);
                textInput.value = "";
            }
        });
    }
  
    if (listenerSendMouse == 0) {
        listenerSendMouse = 1;
  
        send.addEventListener('click', async function(e) {
            e.preventDefault();
            let messageText = textInput.value;
            sendMes(messageText);
            textInput.value = "";
        });
    }

    async function sendMes(message) {
        let freshConversationId = send.getAttribute('conversationId');
        
        if (message !== "") {
                /// get last mesages
                let last = await actor.getConversation(freshConversationId);
                // console.log(last[0]);      <------ массив с объектами сообщений 
                let messageId = makeid(16);

                let newMessage = {
                    userId : [myProfId[0]],
                    userPrincipalText : [myPrincipal],
                    messageId: [messageId],
                    text : [message]
                };
                last[0].push(newMessage);
                console.log(last[0]);
                textInput.value = "";
                // выводим фейк в поле сообщений
                let messageZone = document.querySelector('.messagesWrap .messages');
                let messageItem = `
                    <div class="message me" messageId="${messageId}">
                        <div class="photo">
                            <img src="${myPhoto}" alt="">
                        </div>
                        <div class="text">
                            <p>${message}</p>
                        </div>
                    </div>
                `;
                messageZone.innerHTML += messageItem;
                messageZone.scrollIntoView(false);
                
              


                // preloaderOn();
                // messageForHeart('Sending a message');
                let exportResult = await actor.setConversation(freshConversationId, last[0]);
                console.log(exportResult);
                // preloaderOff();
        }
    }






};


    // даем прослушку верхнему блоку для перехода на профиль 
    let upBlockUser = document.querySelector('.opponent');
    upBlockUser.addEventListener('click', function() {
        let principal = this.getAttribute('principal');
        openUserProfile(principal, 1);
        console.log('выполнили РО')
    });


    let outChat = document.querySelector('.tab.chat .firs_logo .crown');
    if (outChat) {
        outChat.addEventListener('click', function() {
            rollBack();
            getAllConversatioons();
            offMessagesInterval();
        });
    }

    let createConversationBtn = document.querySelector('.createChat');
    createConversationBtn.addEventListener('click', function() {
        rollBack();
        getAllUsers()
    });
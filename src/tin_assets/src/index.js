
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
// import { ContextExclusionPlugin } from "webpack";
import {os} from "os-browserify";
// import { BncClient } from "@binance-chain/javascript-sdk"
import { tin, canisterId, createActor } from "../../declarations/tin";
import { setUncaughtExceptionCaptureCallback } from "process";


try {

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
let filterByYears      = document.querySelectorAll('.value-list.years li');
let filterByGender     = document.querySelectorAll('.value-list.gender li');
let settingsModal      = document.querySelector('.settings_modal');
let logOutBtn          = settingsModal.querySelector('.logout');
let deleteBtn          = settingsModal.querySelector('.delete');
let communityButton    = document.querySelector('.profileBtn.community');
let myWalletButton     = document.querySelector('.profileBtn.wallet');
let deletePhotoBtns    = document.querySelectorAll('.photoModal .deletePhoto');
let updateavatar       = document.querySelector('.updateAvatar');
let addNewPhoto        = document.querySelector('.updateGallery');
let uploadNewPhoto     = document.querySelector('button.uploadNewPhoto');
let inputField         = document.querySelectorAll('.selectItem');
let dropdowns          = document.querySelectorAll('.value-list');
let smileModal         = document.querySelector('.smileModal');
let tabChat            = document.querySelector('.tab.chat');
let smileBtn           = document.querySelector('.smilebtn');
let smiles             = document.querySelectorAll('.smileModal .item');
let recomendMedia      = document.querySelector('.globalWrap .recomendationsWrap .mediaAndPosts .mediaWrap .items');






let authClient;
let actor;
let identity;

const init = async () => {
    preloaderOn();
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient, 'true');
        tabReadme.forEach((el) => {el.remove()});
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
          handleAuthenticated(authClient, 'false');
          preloaderOff();
          console.log('login succes');
        },
      });
    };
  };

  async function handleAuthenticated(authClient, status) {
    identity = await authClient.getIdentity();
    actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });
       if (status == 'true') {
         who = identity._principal.toString()
       } else {
           let res = await actor.whoami();
        who = res.toString();
       }
      preloaderOff();
      getProfile(1, who);
    }
init();
let who;

async function loadRecomendations() {
    let res = await actor.allUsers();
    log(res)
    let usersObjects = [];
    res.forEach((el) => {
        usersObjects.push(el[1].userData);
    });
    log(usersObjects)
    let photosIds = [];
    let postsIds = [];
    for(let i = 0; i < 50; i++) {
        if (usersObjects[i] !== undefined && usersObjects[i] !== null) {
            if (usersObjects[i].profileId[0] !== myMotokoObject.profileId[0]) {

                usersObjects[i].profilePhotoIds.forEach((el) => {
                    photosIds.push(el[0]);
                });

                log(usersObjects[i].posts)
                
                if (usersObjects[i].posts.length !== 0) {
                    let postsCount = Number(usersObjects[i].posts[0]);
                    let opanentId = usersObjects[i].profileId[0];
                    log(postsCount)
                    log(opanentId)
                    if (postsCount == 1 || postsCount > 1) {
                        postsIds.push(opanentId + '0', opanentId + '1');
                    } else {
                        postsIds.push(opanentId + '0');
                    }
                }
                

            }
        }
    }
    log(photosIds);
    log(postsIds);

    // get photos and posts 
    let photosPromise = [];
    let blogsPromise = [];
    photosIds.forEach((el) => {
        photosPromise.push(actor.getPhoto(el));
    });
    postsIds.forEach((el) => {
        blogsPromise.push(actor.getPost(el));
    });

    let resPhotos = await Promise.all(photosPromise).then((data) => {return data});
    renderRecomendPhotos(resPhotos.reverse());
    let resPosts  = await Promise.all(blogsPromise).then((data) => {return data});
    log(resPhotos);
    log(resPosts);

    

};

function renderRecomendPhotos(resPhotos) {
    console.log('work')
    recomendMedia.innerHTML = "";
    resPhotos.forEach((el) => {
        let photoItem = `
            <div class="item">
                <img src="${el[0].src[0]}">
            </div>
        `;
        recomendMedia.innerHTML += photoItem;
    });

};


function log(log) {console.log(log)};

function preloaderOn() {
    preloader.classList.add('loader--active');
};

function preloaderOff() {
    preloader.classList.remove('loader--active');
};


// create account listener
createUser.addEventListener('click', () => {createAccount()});
// delete account listener
deleteBtn.addEventListener('click',  () => {deleteAccount()});
// button myCommunity listener
communityButton.addEventListener('click', () => {
    runRoll();runRoll();runRoll();runRoll();runRoll();
    openCommunity();
});
// listen button myWallet
myWalletButton.addEventListener('click', async function() {alert('Soon');});
// listen delete photo in modal
deletePhotoBtns.forEach((el) => {el.addEventListener('click', async function() {deletePhoto(this);});});
// listen update avatar button
updateavatar.addEventListener('change', function(event) {event.stopPropagation();let type = 'avatar';onFileAdded(event, type);});
// listen add New Photo button
addNewPhoto.addEventListener('change', function(event) {let type = 'newPhoto';onFileAdded(event, type);});
// listen button upload new photo
uploadNewPhoto.addEventListener('click', function(event) {uploadNewPhotoFunc(event, this)});
// event listener smile
smileBtn.addEventListener('click', function(e) {e.stopPropagation();smileModal.classList.add('active');});
// при нажатии в области чата закрывать модалку с смайлами
tabChat.addEventListener('click', () => {smileModal.classList.remove('active')});
// пропагатион на модалке со смайлами
smileModal.addEventListener('click', function(e) {
    e.stopPropagation();
});
// прослушка каждого смайлика
smiles.forEach((el) => {el.addEventListener('click', function() {let value = this.getAttribute('value');sendMes(value);smileModal.classList.remove('active');})});

    







gear.addEventListener('click', async function() {
    console.log('dali proslushku gear')

    
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


    // console.log(res);
    // location.reload();
});



async function deleteAccount() {
    preloaderOn();
    messageForHeart('Delete your account');
    // получаем список всех наших конвертаций
    let myProf = await actor.read();
    console.log('получили наш профиль')
    console.log('получили массив с номерами наших бесед');
    console.log(myProf[0].userData.conversations);
    console.log('получили массив с номерами наших видео');
    console.log(myProf[0].userData.profileVideoIds);
    // console.log('получили массив с номерами наших фото');
    // console.log(myProf[0].userData.profilePhotosIds);
    // // собираем массив с обещаниями 
    // let promiseDeletePhotos = [];
    // myProf[0].userData.profilePhotosIds.forEach((el) => {
    //     promiseDeletePhotos.push(actor.deletePhoto(el[0]))
    // });
    let promiseDeleteConvers = [];
    myProf[0].userData.conversations.forEach((el) => {
        promiseDeleteConvers.push(actor.deleteConversation(el[0]));
    });
    let promiseDeleteVideoChunks = [];
    myProf[0].userData.profileVideoIds.forEach((el) => {
        console.log('VIDEO ID');
        console.log(el[0]);
        // так же пушим хэш превью к видео 
        promiseDeleteVideoChunks.push(actor.deleteChunk(el[0] + String(99)));
        // запускаем цикл сборки обещаний на удаления каждого чанка каждого видео
        for(let i = 0; i < 12; i++) {
            promiseDeleteVideoChunks.push(actor.deleteChunk(el[0] + String(i)));
        };
    });
    let res = await actor.delete();
    console.log('Удалили аккаунт')

    await Promise.all(promiseDeleteConvers).then((data) => {
        console.log(data);
        console.log('удалили беседы')
        preloaderOff();
        // location.reload();
    });
    // await Promise.all(promiseDeletePhotos).then((data) => {
    //     console.log(data);
    //     console.log('удалили все фото')
    //     preloaderOff();
    // });
    await Promise.all(promiseDeleteVideoChunks).then((data) => {
        console.log(data);
        console.log('удалили все чанки видео')
        preloaderOff();
        location.reload();
    });
};






function messageForHeart(message) {
    let spanHeart = document.querySelector('.loader span');
    spanHeart.innerHTML = message;
};

let myPrincipal = '';
let myMotokoObject = '';
let myLikesObject = '';
let myProfId = '';
let myPhotoIds = '';
let myPhoto = '';
let myName = '';

let lastViewedPrincipal;
let lastViewedProfileObject;
let lastViewedProfilePhoto;
let lastViewedProfileName;




// listen inputs add New Media Files
let addNewMediaInputs = document.querySelectorAll('.addPhotoModal input');
addNewMediaInputs.forEach((el) => {
    el.addEventListener('click', function(event) {
        event.stopPropagation();
    })
});
 
// listen button add photos 
let uploadPhotosPlus = document.querySelector('.profilePhotoWrap .upload');
uploadPhotosPlus.addEventListener('click', function(event) {
    event.stopPropagation();
    let addPhotoModal = document.querySelector('.addPhotoModal');
    addPhotoModal.classList.add('active');
    console.log(myMotokoObject)
    // console.log(myMotokoObject.profilePhotosIds.length)
});

// listen close addNewPhotosModal 
let newPhMo = document.querySelector('.addPhotoModal');
newPhMo.addEventListener('click', function() {
    newPhMo.classList.remove('active');
    // возвращаем исходный вид окна загрузки новых фото и закрываем 
    let ph = document.querySelector('.addPhotoModal .selects');
    ph.innerHTML = "";
    let allBtns = document.querySelectorAll('.addPhotoModal button');
    allBtns.forEach((el) => {
        el.classList.add('active');
    });
    let submBtn = document.querySelector('.addPhotoModal .uploadNewPhoto');
    submBtn.classList.remove('active');
});



async function uploadNewPhotoFunc(event, element) {
    event.stopPropagation();
    let type = element.getAttribute('type');
    let newPhotoEl = document.querySelector('.addPhotoModal .photoBox img');
    if (type == 'avatar') {
        myMotokoObject.mainPhoto = [newPhotoEl.src];
        // сразу устанавливаем новый аватар 
        let avatarPhoto = document.querySelector('.tab.profile .profile_information .left .photo_box > img'); 
        avatarPhoto.src = newPhotoEl.src;
        // возвращаем исходный вид окна загрузки новых фото и закрываем 
        let ph = document.querySelector('.addPhotoModal .selects');
        ph.innerHTML = "";
        let allBtns = document.querySelectorAll('.addPhotoModal button');
        allBtns.forEach((el) => {
            el.classList.add('active');
        });
        let submBtn = document.querySelector('.addPhotoModal .uploadNewPhoto');
        submBtn.classList.remove('active');
        let addPhotoModal = document.querySelector('.addPhotoModal');
        addPhotoModal.classList.remove('active');
        let exportArr = await actor.updateUserData(myPrincipal, {userData: myMotokoObject});
        log(exportArr)
    } 
    if (type == 'newPhoto') {
        let profileId = myMotokoObject.profileId[0];
        let freshPhotoIdsArr = myMotokoObject.profilePhotoIds;
        let newPhotoNumber = profileId + makeid(16);
        freshPhotoIdsArr.push([newPhotoNumber]);
        myMotokoObject.profilePhotosIds = freshPhotoIdsArr;
        // сразу добавляем новое фото в профиль
        let profilePhotosWrap = document.querySelector('.selectPhotosWrap');
        let child = '<div class="child"><img class="photoChildImg" principal="'+ myPrincipal +'" baseid="'+ newPhotoNumber +'" src="'+ newPhotoEl.src +'" alt=""></div>';
        profilePhotosWrap.insertAdjacentHTML('afterBegin', child);
        addEventListenersProfileVideos();
        addEventListenersProfilePhotos();
        clickAllProfileVideos();
        // возвращаем исходный вид окна загрузки новых фото и закрываем 
        let ph = document.querySelector('.addPhotoModal .selects');
        ph.innerHTML = "";
        let allBtns = document.querySelectorAll('.addPhotoModal button');
        allBtns.forEach((el) => {
            el.classList.add('active');
        });
        let submBtn = document.querySelector('.addPhotoModal .uploadNewPhoto');
        submBtn.classList.remove('active');
        let addPhotoModal = document.querySelector('.addPhotoModal');
        addPhotoModal.classList.remove('active');

        let result = await Promise.all([actor.updateUserData(myPrincipal, {userData: myMotokoObject}), actor.setPhoto(newPhotoNumber, { id: [newPhotoNumber], likes: ['0'], src: [newPhotoEl.src]})]).then((data) => {return data;})
        log(result);
    }
};






// listen button editProfile
let profileEditButton = document.querySelector('.tab.profile .firs_logo .crown');
profileEditButton.addEventListener('click', function() {
    alert('soon')
});

// listen tabs in profile 
let allChangeMiniRoll = document.querySelectorAll('.tab.profile .profile_tabs_photos .change');
allChangeMiniRoll.forEach((el) => {
    el.addEventListener('click', function() {
        allChangeMiniRoll.forEach((x) => {
            x.classList.remove('active');
        });
        if (this.classList.contains('photos')) {
            miniRoll(1, 'profile')
            this.classList.add('active');
        }
        if (this.classList.contains('blog')) {
            miniRoll(2, 'profile')
            this.classList.add('active');
        }
        if (this.classList.contains('info')) {
            miniRoll(3, 'profile')
            this.classList.add('active');
        }
    });
})

// listen tabs in user tab
let allChangeMiniRollUserTab = document.querySelectorAll('.tab.user .profile_tabs_photos .change');
allChangeMiniRollUserTab.forEach((el) => {
    el.addEventListener('click', function() {
        allChangeMiniRollUserTab.forEach((x) => {
            x.classList.remove('active');
        });
        if (this.classList.contains('photos')) {
            miniRoll(1, 'user')
            this.classList.add('active');
        }
        if (this.classList.contains('blog')) {
            miniRoll(2, 'user')
            this.classList.add('active');
        }
        if (this.classList.contains('info')) {
            miniRoll(3, 'user')
            this.classList.add('active');
        }
    });
})


function miniRoll(state, tab) {
    let miniRoll;
    if (tab == 'user') {
        miniRoll = document.querySelector('.tab.user .miniRoll');
    }
    if (tab == 'profile') {
        miniRoll = document.querySelector('.tab.profile .miniRoll');
    }
    if (state == 1) {
        miniRoll.style.transform = "translateX(375px)";
    }
    if (state == 2) {
        miniRoll.style.transform = "translateX(0px)";
    }
    if (state == 3) {
        miniRoll.style.transform = "translateX(-375px)";
    }
}




async function getProfile(rollBacks, principal) {
    let photoZone = document.querySelector('.tab.profile .selectPhotos .selectPhotosWrap');
    photoZone.innerHTML = ""
    
    preloaderOn();
    messageForHeart('Get your profile');
    myPrincipal = principal.toString();

    let res;
    let resLikes;

    let resPromise = await Promise.all([actor.read(), actor.getLikesObj(myPrincipal)]).then((data) => {return data});

    res = resPromise[0];
    resLikes = resPromise[1];

    myLikesObject = resLikes;
    
    console.log('Лайкнутые посты')
    console.log(resLikes);

    console.log('PROFILE')
    console.log(res)

    preloaderOff();

    // throw 'err'


    
    if (res == null || res == "" || res == undefined) {
        console.log('Профиль не создан');
        preloaderOff();
    }
    
    if (res.length > 0) {

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

        myMotokoObject = res[0].userData;


        log('photos id list');
        log(myMotokoObject.profilePhotoIds);


        let promisePhotos = [];
        myMotokoObject.profilePhotoIds.forEach((el) => {
            promisePhotos.push(actor.getPhoto(el[0])); 
        });
        let profilePhotos = await Promise.all(promisePhotos).then((data) => {return data});
        log('Ours photos');
        log(profilePhotos);

        myProfId = res[0].userData.profileId;
        myPhoto = res[0].userData.mainPhoto;
        myName = res[0].userData.name;
       
        paginationWrapper.remove();
        messageForHeart('Deploy your data on page');
        // RENDER NAME, BIRTH and PHOTOS 
        let name = document.querySelector('.name_age_box .name');
        // let dateOfBirth = document.querySelector('.name_age_box .age');
 
        name.innerHTML = res[0].userData.name;
        // Конвертируем дату в года и выводим в профиль
        // let dateNow = Date.parse(new Date());
        // let birthDate = Date.parse(res[0].userData.dateOfBirth);
        // let resultMs = dateNow - birthDate;
        // let resultAge = Math.floor(resultMs / (1000 * 60 * 60 * 24 * 30 * 12));
        // dateOfBirth.innerHTML = resultAge;
        // конец вывода даты
        // составляем массив обещаний на получение фото профиля и получаем фото
        // let photoPromiseArr = [];
        // myPhotoIds.forEach((el) => {
        //     photoPromiseArr.push(actor.getPhoto(el[0]));
        // });
        
        // console.log('PHOTO IDS');
        // console.log(myPhotoIds);
        // let resultPhotos = await Promise.all(photoPromiseArr).then((data) => {
        //     console.log('ПОЛУЧИЛИ ВСЕ НАШИ ФОТО');
        //     console.log(data);
        //     return data.reverse();
        // });

        // let profilePhotos = resultPhotos;
        let profilePhotosWrap = document.querySelector('.selectPhotosWrap');
        let mainPhoto = document.querySelector('.left .photo_box img');
        mainPhoto.src = myPhoto;
        profilePhotos.reverse().forEach((el, index) => {
            let child = '<div class="child"><img class="photoChildImg" principal="'+ myPrincipal +'" baseid="'+ el[0].id[0] +'" src="'+ el[0].src[0] +'" alt=""></div>';
            profilePhotosWrap.innerHTML += child;
        });

        // END RENDER NAME, BIRTH and PHOTOS 
               // убираем прелоадер с главного фото
               let mainPh = document.querySelector('.tab.profile .profile_information .photo_box img');
               let preEl = document.querySelector('.tab.profile .profile_information .photo_box .preElement');
               mainPh.style.display = "block";
               preEl.classList.remove('active');

        let getVideoIds = res[0].userData.profileVideoIds;
        //получаем превьюшки видео 
        console.log('НОМЕРА ВИДЕО');
        console.log(getVideoIds);
        //собираем номера наших превьюшек видео и складываем сразу в обещание на получение превьюшек
        let previewsPromise = [];
        for(let i = 0; i < getVideoIds.length; i++) {
            previewsPromise.push(actor.getChunk(String(getVideoIds[i]) + String(99)));
        };
        const responsesPreview = await Promise.all(previewsPromise).then((data) => {
            console.log('ПРИЕХАЛИ НАШИ ПРЕВЬЮШКИ')
            
            console.log(data);
            return data
        });
        // convert big int to number 
        let numbersResult = [];
        for(let i = 0; i < getVideoIds.length; i++) {
            numbersResult.push(getVideoIds[i]);
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
            // <video id="video" width="135" height="180" controls>
            //     <source src=""> 
            // </video> 
            let videoItem = `
            <div class="child video" videoId="${getVideoIds[j]}" base64="">
                <img class="videoPreview" src="${responsesPreview[j]}">
                <img class="playVideo" src="img/play_video.png">
              
            </div>
            `;
            profilePhotosWrap.innerHTML += videoItem;
        };
        // рендерим плееры равное количеству наших видео 
        let videoWrap = document.querySelector('.tab.profile .videoModalWrap');
        videoWrap.innerHTML = '';
        for(let j = 0; j < getVideoIds.length; j++) {
            let item = `
            <video id="video" preload="auto" width="370" videoId='${getVideoIds[j]}' controls>
                <source src="">
            </video>
            `;
            videoWrap.innerHTML += item;
        };

// получаем наши посты из блога 

log(myMotokoObject.profilePostIds)
if (myMotokoObject.profilePostIds.length !== 0) {

    
    let likesPostsArr = [];
    if (myLikesObject.length !== 0) {
        likesPostsArr = myLikesObject[0];
    }


    let promiseArr = [];
    for(let i = 0; i < myMotokoObject.profilePostIds.length; i++) {
        promiseArr.push(actor.getPost(myMotokoObject.profilePostIds[i][0]));
    };
    
    let postsWrap = document.querySelector('.profileBlog .blogWrap .blogPosts');
    postsWrap.innerHTML = "";

    await Promise.all(promiseArr).then(async (data) => {
        console.log(data)

        for(let i = data.length - 1; i > -1; i--) {
            if (data[i].length) {
                let postItem;
                if (data[i][0].vid.length !== 0) {
                    let opRes = await actor.getUser(data[i][0].opId[0]);
                    let origPosData = await actor.getPost(data[i][0].repOrigPostId[0]);
                    log('EROOOR')
                    log(opRes[0].userData.name);
                    log(origPosData[0].text);
                    postItem = `
                    <div class="blogPost" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}" style="flex-direction: column; padding-bottom: 0;">
                        <div class="remove">
                            <img src="img/closed.svg">
                        </div>
                        <div class="wrap">
                 
                            <div class="info">
                                <span style="color: rgb(65, 65, 65); font-weight: 400; font-size: 13px;">You reposted</span>
                            </div>
                        </div>

                        <div class="repData" style="display: flex; margin-top: 6px;">
                            <div class="photo">
                                <img src="${opRes[0].userData.mainPhoto[0]}">
                            </div>
                            <div class="info">
                                <span>${opRes[0].userData.name[0]}</span>
                                <p>${origPosData[0].text[0]}<p/>
                            </div">
                        </div>
                    </div>
                `;
                postsWrap.innerHTML += postItem
                } else {
                    
                    if (likesPostsArr.includes(data[i][0].id[0])) {
                        postItem = `
                        <div class="blogPost" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}">
                            <div class="remove">
                                <img src="img/closed.svg">
                            </div>
                            <div class="photo">
                                <img src="${myMotokoObject.mainPhoto}" alt="">
                            </div>
                            <div class="info">
                                <span>${myMotokoObject.name}</span>
                                <p>${data[i][0].text}</p>
                                <div class="social">
             
                                    <div class="likes">
                                        <img class="active" itemId="${data[i][0].id[0]}" src="img/like.svg" alt="">
                                        
                                        <span>${data[i][0].likes}</span>
                                        
                                    </div>
                                    <div class="comments" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}">
                                        <img src="img/comment.svg" alt="">
                                        <span>${data[i][0].comments}</span>
                                    </div>
                                    <div class="reposts">
                                        <img src="img/reposts.svg" alt="">
                                        <span>${data[i][0].reposts}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    } else {
                        postItem = `
                        <div class="blogPost" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}">
                            <div class="remove">
                                <img src="img/closed.svg">
                            </div>
                            <div class="photo">
                                <img src="${myMotokoObject.mainPhoto}" alt="">
                            </div>
                            <div class="info">
                                <span>${myMotokoObject.name}</span>
                                <p>${data[i][0].text}</p>
                                <div class="social">
         
                                    <div class="likes">
                                        <img itemId="${data[i][0].id[0]}" src="img/like.svg" alt="">
                                        
                                        <span>${data[i][0].likes}</span>
                                        
                                    </div>
                                    <div class="comments" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}">
                                        <img src="img/comment.svg" alt="">
                                        <span>${data[i][0].comments}</span>
                                    </div>
                                    <div class="reposts">
                                        <img src="img/reposts.svg" alt="">
                                        <span>${data[i][0].reposts}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    }
                    postsWrap.innerHTML += postItem
                }
                
                
            }
            

            

            
        };

        // listen remove
        let removes = document.querySelectorAll(".profileBlog .blogWrap .blogPosts .blogPost .remove"); 

        removes.forEach((el) => {
            el.addEventListener('click', function() {
                removePost(this);
            });
        });

        // listen likes 
        let likes = document.querySelectorAll(".profileBlog .blogWrap .blogPosts .blogPost .info .social .likes img");
        
        likes.forEach((el) => {
            el.addEventListener('click', function() {
                setLike(this);
            });
        });

        // listen comments 
        let commentsBtn = document.querySelectorAll('.profileBlog .blogWrap .blogPosts .blogPost .info .social .comments');
        commentsBtn.forEach((el) => {
            el.addEventListener('click', function() {
                let blogId = this.getAttribute('itemid');
                let comsCount = this.getAttribute('coms');
                openCommentsModal(this, null, blogId, comsCount);
            });
        });


        // listen reposts
        // let repostsBtn = document.querySelectorAll('.profileBlog .blogWrap .blogPosts .blogPost .info .social .reposts');
        // repostsBtn.forEach((el) => {
        //     el.addEventListener('click', function() {
        //         // let blogId = this.getAttribute('itemid');
        //         // let comsCount = this.getAttribute('coms');
        //         repostQuery(this);
        //     });
        // });

   
    });
}

        addEventListenersProfileVideos();
        addEventListenersProfilePhotos();
        clickAllProfileVideos();

        

    };

};

// listen user sure modal

let sureRepostModal = document.querySelector('.tab.user .sureRepost');
let sureRepostCloseModal = document.querySelector('.tab.user .sureRepost .remove');
let sureRepostNoBtn = document.querySelector('.tab.user .sureRepost button.no');
let sureRepostYesBtn = document.querySelector('.tab.user .sureRepost button.yes');

sureRepostCloseModal.addEventListener('click', function() {
    sureRepostModal.classList.remove('active');
});

sureRepostNoBtn.addEventListener('click', function() {
    sureRepostModal.classList.remove('active');
});

sureRepostYesBtn.addEventListener('click', async function() {
    log('REPOST')
    sureRepostModal.classList.remove('active');
    let postId = this.getAttribute('blogid');
    let opPrinc = this.getAttribute('princ');

    // получаем пост опанента по id 
    let post = await actor.getPost(postId);
    log(post)

    let repostsCount = Number(post[0].reposts[0]);
    repostsCount += 1;
    post[0].reposts = [String(repostsCount)];

    let userPrincipal = opPrinc;
    let originalPostId = post[0].id[0];
    let text = post[0].text[0];

    console.log(userPrincipal)
    console.log(originalPostId)
    console.log(text)

    // отправляем новый пост к себе 
    let myPostId = makeid(32);

    
    
    myMotokoObject.profilePostIds.push([myPostId]);
    let ress = await Promise.all([actor.setPost(myPostId, {id: [myPostId], text: [text], likes: ['0'], comments: ['0'], reposts: ['0'], vid : ['repost'], opId : [userPrincipal], repOrigPostId: [originalPostId]}),actor.updateUserData(myPrincipal, {userData: myMotokoObject}),actor.setPost(originalPostId, post[0])]).then((data) => {return data})
    // let result = await ;
    // let profRes = await ;
    // let addRepostToPost = await ;
    log(ress)
    
    
    // console.log(id)
    //     let res = await actor.deletePost(id);
    //     console.log(res);
    
    //     let fresh = myMotokoObject.profilePostIds;
    //     let clear = [];
    //     for(let i = 0; i < fresh.length; i++) {
    //         if (fresh[i][0] !== id) {
    //             clear.push([fresh[i][0]])
    //         }
    //     };
    //     myMotokoObject.profilePostIds = clear
    //     let res2 = await actor.updateUserData(myPrincipal, {userData: myMotokoObject})
    //     console.log(res2)
    
    
});


// listen profile removePost item 
let profileBlogModal = document.querySelector('.profileBlog .sure');
let profileCloseModal = document.querySelector('.profileBlog .sure .remove');
let profileNoBtn = document.querySelector('.profileBlog .sure .btns button.no');
let profileYesBtn = document.querySelector('.profileBlog .sure .btns button.yes');

profileCloseModal.addEventListener('click', function() {
    profileBlogModal.classList.remove('active');
});

profileNoBtn.addEventListener('click', function() {
    profileBlogModal.classList.remove('active');
});

profileYesBtn.addEventListener('click', async function() {
    let id = this.getAttribute('itemId');

    let pagePost = document.querySelector('.profileBlog .blogWrap .blogPosts .blogPost[itemid="' + id + '"]');
    pagePost.remove();
    profileBlogModal.classList.remove('active');

    console.log(id)
        
    
        let fresh = myMotokoObject.profilePostIds;
        let clear = [];
        for(let i = 0; i < fresh.length; i++) {
            if (fresh[i][0] !== id) {
                clear.push([fresh[i][0]])
            }
        };
        myMotokoObject.profilePostIds = clear
        let ress = await Promise.all([actor.deletePost(id), actor.updateUserData(myPrincipal, {userData: myMotokoObject})]);
        // let res = await actor.deletePost(id);
        // console.log(res);
        // let res2 = await actor.updateUserData(myPrincipal, {userData: myMotokoObject})
        // console.log(res2)
        console.log(ress)
    
    
});


// listen commentsModal textAreas
// let commentsModalTextAreas = document.querySelectorAll('.commentsModal textArea input');
let commentsModalSendComment = document.querySelectorAll('.commentsModal .textArea .sen');
commentsModalSendComment.forEach((el) => {
    el.addEventListener('click', function() {
        let text = this.previousSibling.value;
        log(text);
        if (text !== "") {
            this.previousSibling.value = "";
            this.previousSibling.classList.add('block');
            sendComment(this.parentElement.parentElement, text, this.previousSibling);
        }
    });
});


async function sendComment(modal, text, inputEl) {
    let postId = modal.getAttribute('itemId');
    let coms = modal.getAttribute('coms');
    let newComId = Number(coms) + 1;
    let newComKey = postId + String(newComId);


// add fake 

let photo = myMotokoObject.mainPhoto;
let name = myMotokoObject.name;

let commentsArea = modal.querySelector('.comments');
let item = `
    <div class="userComment">
        <div class="photo">
            <img src="${photo}" alt="">
        </div>
        <div class="info">
            <span>${name}</span>
            <p>${text}</p>
        </div>
    </div>
`;
commentsArea.innerHTML += item;

    // let res = await actor.setBlogCom(newComKey, {text: text});
    let res3 = await actor.getPost(postId);
    
    let postValue = res3[0];
    postValue.comments = [String(newComId)];



    let res = await Promise.all([actor.setBlogCom(newComKey, {text: [text], userId: [myPrincipal]}), actor.setPost(postId, postValue)]).then((data) => {return data});

    inputEl.classList.remove('block');
    log(res)
    
};

// listen post Comments modal 
let commentModal = document.querySelector('.commentsModal')
let commentsModalClose = document.querySelector('.commentsModal .close');
commentsModalClose.addEventListener('click', function() {
    commentModal.classList.remove('active');
});

let commentModalUser = document.querySelector('.tab.user .commentsModal')
let commentsModalCloseUser = document.querySelector('.tab.user .commentsModal .close');
commentsModalCloseUser.addEventListener('click', function() {
    commentModalUser.classList.remove('active');
});

async function openCommentsModal(element, mod, itemId, countComs) {
    if (mod == 'user') {
        let modal = document.querySelector('.tab.user .commentsModal');
        modal.setAttribute('itemId', itemId);
        modal.setAttribute('coms', countComs);
        modal.classList.add('active');

        // log('pp')
        // log(element.parentElement.parentElement.parentElement)
        let plogPost = element.parentElement.parentElement.parentElement;
        
        let img = plogPost.querySelector('.photo img');
        let name = plogPost.querySelector('.info span');
        let text = plogPost.querySelector('.info p');
    
        let imgModal = document.querySelector('.tab.user .commentsModal .blogPost .photo img');
        let nameModal = document.querySelector('.tab.user .commentsModal .blogPost .info span');
        let textModal = document.querySelector('.tab.user .commentsModal .blogPost .info p');
    
        imgModal.src = img.src;
        nameModal.innerHTML = name.textContent;
        textModal.innerHTML = text.textContent;

        // load comments 
        // получаем все ключи комментариев 
        let comKeys = [];
        for(let i = 1; i < Number(countComs) + 1; i++) {
            comKeys.push(actor.getBlogCom(itemId + String(i)));
        };
        log('PZ')
        log(comKeys)
        let rese = await Promise.all(comKeys).then((data) => {return data});
        console.log(rese)
        let usersDataPromises = [];
        for(let i = 0; i < rese.length; i++) {
            usersDataPromises.push(actor.getUser(rese[i][0].userId[0]));
        };
        let per = await Promise.all(usersDataPromises).then((data) => {return data});
        log(per)

        let commentsArea = modal.querySelector('.comments');
        commentsArea.innerHTML = "";
        for(let i = 0; i < rese.length; i++) {
            let item = `
                <div class="userComment">
                    <div class="photo">
                        <img src="${per[i][0].userData.mainPhoto}" alt="">
                    </div>
                    <div class="info">
                        <span>${per[i][0].userData.name}</span>
                        <p>${rese[i][0].text}</p>
                    </div>
                </div>
            `;
            commentsArea.innerHTML += item;
        };

    } else {
        let modal = document.querySelector('.commentsModal');
        modal.setAttribute('itemId', itemId);
        modal.setAttribute('coms', countComs);
        modal.classList.add('active');
        // log('pp')
        // log(element.parentElement.parentElement.parentElement)
        let plogPost = element.parentElement.parentElement.parentElement;
        
        let img = plogPost.querySelector('.photo img');
        let name = plogPost.querySelector('.info span');
        let text = plogPost.querySelector('.info p');
    
        let imgModal = document.querySelector('.commentsModal .blogPost .photo img');
        let nameModal = document.querySelector('.commentsModal .blogPost .info span');
        let textModal = document.querySelector('.commentsModal .blogPost .info p');
    
        imgModal.src = img.src;
        nameModal.innerHTML = name.textContent;
        textModal.innerHTML = text.textContent;

        // load comments 
        // получаем все ключи комментариев 
        let comKeys = [];
        for(let i = 1; i < Number(countComs) + 1; i++) {
            comKeys.push(actor.getBlogCom(itemId + String(i)));
        };
        log('PZ')
        log(comKeys)
        let rese = await Promise.all(comKeys).then((data) => {return data});
        console.log(rese)
        let usersDataPromises = [];
        for(let i = 0; i < rese.length; i++) {
            usersDataPromises.push(actor.getUser(rese[i][0].userId[0]));
        };
        let per = await Promise.all(usersDataPromises).then((data) => {return data});
        log(per)

        let commentsArea = modal.querySelector('.comments');
        commentsArea.innerHTML = "";
        for(let i = 0; i < rese.length; i++) {
            let item = `
                <div class="userComment">
                    <div class="photo">
                        <img src="${per[i][0].userData.mainPhoto}" alt="">
                    </div>
                    <div class="info">
                        <span>${per[i][0].userData.name}</span>
                        <p>${rese[i][0].text}</p>
                    </div>
                </div>
            `;
            commentsArea.innerHTML += item;
        };


 
    }


 

};

async function removePost(element) {
    let modalSure = document.querySelector('.profileBlog .sure');
    modalSure.classList.add('active');
    let el = element.parentElement;
    let postId = el.getAttribute('itemId');
    log(postId);
    profileYesBtn.setAttribute('itemId', postId);

};

async function repostQuery(el, princ, blogId) {
    // проверяем есть ли айдишник поста уже в наших репостах 
    // получаем все наши айди постов

    // let myProfilePostsIds = myMotokoObject.profilePostIds;
    // for(let i = 0; i < myProfilePostsIds.length; i++) {
    //     if (myProfilePostsIds[i][0] == myProfilePostsIds)
    // };

    let modalSure = document.querySelector('.sureRepost');
    modalSure.classList.add('active');
    sureRepostYesBtn.setAttribute('blogId', blogId);
    sureRepostYesBtn.setAttribute('princ', princ);
};

async function setLike(element) {
    element.classList.add('block');
    console.log('прожали лайк')
    let itemId = element.getAttribute('itemId');
    if (element.classList.contains('active')) {
        // имеет наш лайк
        // даем цвет сердечку
        element.classList.remove('active');
        // уменьшаем счетчик -1 
        let countEl = element.parentElement.querySelector('span');
        let count = Number(countEl.textContent);
        count -= 1;
        countEl.textContent = count;
        // записываем в пост -1
            // получаем объект поста 
            let resPost = await actor.getPost(itemId);
            console.log(resPost[0]);
            let postObj = resPost[0];
            let likesCount = Number(postObj.likes[0]);
            likesCount -= 1;
            postObj.likes = [String(likesCount)];
            console.log(likesCount)

        // убираем из личного объекта лайков номер поста 
        let resMyLikesArr = myLikesObject;
        console.log(resMyLikesArr);
        
        // объект лайков существует, теперь просто запишем новый номер поста в объект
        resMyLikesArr[0].forEach((el, ind) => {
            if (el == itemId) {
                resMyLikesArr[0].splice(ind, 1);
            }
        });
        // записываем данные поста
        // записываем данные объекта наших лайков
        let res = await Promise.all([actor.setPost(itemId, postObj), actor.setLikesObj(myPrincipal, resMyLikesArr[0])]).then((data) => {
            element.classList.remove('block');
            return data});
        console.log(res);
    } else {
        // не имеет нашего лайка
        element.classList.add('active');
        // увеличиваем счетчик +1
        let countEl = element.parentElement.querySelector('span');
        let count = Number(countEl.textContent);
        count += 1;
        countEl.textContent = count;
        // записываем в пост +1
            // получаем объект поста 
            let resPost = await actor.getPost(itemId);
            console.log(resPost[0]);
            let postObj = resPost[0];
            let likesCount = Number(postObj.likes[0]);
            likesCount += 1;
            postObj.likes = [String(likesCount)];
            console.log(likesCount)

        // кладем в личный объект лайков номер поста 
            let resMyLikesArr = myLikesObject;
            log('MOI LAIKI')
            console.log(resMyLikesArr);
            if (resMyLikesArr.length == 0) {
                // это наш первый лайк
                let likesObj = [itemId];
                // записываем данные поста
                // записываем данные объекта наших лайков
                let res = await Promise.all([actor.setPost(itemId, postObj), actor.setLikesObj(myPrincipal, likesObj)]).then((data) => {
                    element.classList.remove('block');
                    return data});
                console.log(res);
            } else {
                // объект лайков существует, теперь просто запишем новый номер поста в объект
                resMyLikesArr[0].push(itemId);
                // записываем данные поста
                // записываем данные объекта наших лайков
                let res = await Promise.all([actor.setPost(itemId, postObj), actor.setLikesObj(myPrincipal, resMyLikesArr[0])]).then((data) => {
                    element.classList.remove('block');
                    return data});
                console.log(res);
            }

    }
};

function clickAllProfileVideos() {
    let allProfileVideoItems = document.querySelectorAll('.tab.profile .child.video');
    allProfileVideoItems.forEach((el) => {
        // console.log(el.getAttribute('base64'))
        if (el.getAttribute('base64') ==  "") {
            el.click();
        }
    });
}

function clickAllUserVideos() {
    let allProfileVideoItems = document.querySelectorAll('.tab.user .child.video');
    allProfileVideoItems.forEach((el) => {
        // console.log(el.getAttribute('base64'))
        if (el.getAttribute('base64') ==  "") {
            el.click();
        }
    });
}

function addEventListenersProfileVideos() {
    let allVideoItems = document.querySelectorAll('.tab.profile .selectPhotosWrap .child.video');
    if (allVideoItems) {

        allVideoItems.forEach((el) => {
            el.addEventListener('click', function() {
                let videoId = String(this.getAttribute('videoid'));
                if (this.getAttribute('base64') == "") {
                    console.log('видео не загружено');
                    // начинаем загрузку видео 
                    
                    let state = this.getAttribute('state');
                    console.log(state);
                    if (state == null) {
                        this.setAttribute('state','1');
                        //програмное нажатие при входе в профиль
                        let loader = this.querySelector('.loader-element');
                        getFullVideoBase64(videoId, this, loader);
                    }
        
                } else {
        
                    let videoModal = document.querySelector('.videoModal');
                    let video = document.querySelector('video[videoid="'+ videoId +'"]');
                    videoModal.classList.add('active');
                    video.classList.add('active');
                    
                    
                }
    
            });
        });
    }
     // прослушка крестика модалки с видео 
     let videoModalWindow = document.querySelector('.tab.profile .videoModal');
     let closeVideo = document.querySelector('.tab.profile .videoModal > img');
     if (closeVideo) {
         closeVideo.addEventListener('click', function() {
             let videoTag = document.querySelector('.tab.profile .videoModalWrap video.active');
             videoTag.classList.remove('active');
             if (videoModalWindow.classList.contains('active')) {
                 videoModalWindow.classList.remove('active');
             }
         });
     }

};

function addEventListenersUserVideos() {
    let allVideoItems = document.querySelectorAll('.tab.user .selectPhotosWrap .child.video');
    if (allVideoItems) {

        allVideoItems.forEach((el) => {
            el.addEventListener('click', function() {
                let videoId = String(this.getAttribute('videoid'));
                console.log('projali')
                if (this.getAttribute('base64') == "") {
                    console.log('видео не загружено');
                    // начинаем загрузку видео 
                    
                    let state = this.getAttribute('state');
                    console.log(state);
                    if (state == null) {
                        this.setAttribute('state','1');
                        //програмное нажатие при входе в профиль
                        let loader = this.querySelector('.loader-element');
                        getFullVideoBase64(videoId, this, loader);
                    }
        
                } else {
        
                    let videoModal = document.querySelector('.tab.user .videoModal');
                    let video = document.querySelector('video[videoid="'+ videoId +'"]');
                    videoModal.classList.add('active');
                    video.classList.add('active');
                    
                    
                }
    
            });
        });
    }
    // прослушка крестика модалки с видео 
    let videoModalWindow = document.querySelector('.tab.user .videoModal');
    let closeVideo = document.querySelector('.tab.user .videoModal > img');
    if (closeVideo) {
        closeVideo.addEventListener('click', function() {
            let videoTag = document.querySelector('.tab.user .videoModalWrap video.active');
            videoTag.classList.remove('active');
            if (videoModalWindow.classList.contains('active')) {
                videoModalWindow.classList.remove('active');
            }
        });
    }


};



function addEventListenersProfilePhotos() {
    // gallery img popup 
    let allProfileImgs = document.querySelectorAll('.tab.profile .selectPhotos .child img.photoChildImg');
    allProfileImgs.forEach((el) => {
        el.addEventListener('click', function() {
            let baseid = this.getAttribute('baseid');
            let userPrincipal = this.getAttribute('principal');
            let targetImgSrc = this.src;
            let photoModal = document.querySelector('.tab.profile .photoModal');
            let modalImg = document.querySelector('.tab.profile .mainModalImg');
            photoModal.classList.add('active');
            photoModal.setAttribute('baseid', baseid);
            photoModal.setAttribute('principal', userPrincipal);
            modalImg.src = targetImgSrc;
        });
    });

        //close img popup
        let closeModal = document.querySelectorAll('.closeModal');
        closeModal.forEach((el) => {
            el.addEventListener('click', function() {
                this.parentElement.classList.remove('active');
            });
        });
};

function addEventListenersUserPhotos() {
    // gallery img popup 
    let allProfileImgs = document.querySelectorAll('.tab.user .selectPhotos .child img.photoChildImg');
    allProfileImgs.forEach((el) => {
        el.addEventListener('click', function() {
            let targetImgSrc = this.src;
            console.log(targetImgSrc)
            let photoModal = document.querySelector('.tab.user .photoModal');
            let modalImg = document.querySelector('.tab.user .mainModalImg');
            photoModal.classList.add('active');
            modalImg.src = targetImgSrc;
        });
    });

        //close img popup
        let closeModal = document.querySelectorAll('.closeModal');
        closeModal.forEach((el) => {
            el.addEventListener('click', function() {
                this.parentElement.classList.remove('active');
            });
        });
};

async function getFullVideoBase64(stringVideoId, videoItem, preloader) {

    // получаем видео 
    // let chunkId = 0;
    console.log('начинаем загрузку видео из мотоко');
    let chunksFront = [];
    // getCh();
    
    for(let i = 0; i < 12; i++) {
        let resultChunkId = stringVideoId + String(i);
        // let chunk = await actor.getChunk(Number(resultChunkId));
        chunksFront.push(actor.getChunk(resultChunkId));
    };
    console.log("MASSIVE С ОБЕЩАНИЯММИ:" + chunksFront);

    const responses = await Promise.all(chunksFront).then((data) => {
        if (preloader !== null && preloader !== undefined) {
            preloader.classList.remove('active');
        }
        console.log('мы получили все обещания');
        console.log(data);
        console.log(typeof data);
        let base64code = data.join('');
        videoItem.setAttribute('base64', base64code);
        // находим плеер этого id и даем ему этот срц
        let thisVideoPlayer = document.querySelector('.videoModalWrap video[videoid="'+ stringVideoId +'"]');
        thisVideoPlayer.setAttribute('soursee', 'done');
        let videoTag = thisVideoPlayer.querySelector('source');
        videoTag.src = base64code;
        thisVideoPlayer.load();
        // thisVideoPlayer.play();
        // setTimeout(() => {
        //     thisVideoPlayer.pause();
        // }, 1000);


        // let videoHtmlItem = `
        // <video id="video" width="370" controls>
        //     <source src="${base64code}">
        // </video>
        // `;
        // let videoModal = document.querySelector('.videoModal');
        // let videoModalWrap = document.querySelector('.videoModal .videoModalWrap');
        // videoModalWrap.innerHTML = videoHtmlItem;
        // videoModal.classList.add('active');
    });
};



let videosBase64Array = [];
let videoPreviews = [];
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

async function createAccount() {
    let photos = document.querySelectorAll('.selectPhotos .photoBox.img img');
    log('Photo elements');
    log(photos);

    if (photos.length == 0) {alert('You need to upload at least one photo!')} else {
        preloaderOn();
        let genderElement = document.querySelector('.ifProfile .chosen-value span.active');
        let name = newName.value;
        let birthDate = newBirthDate.value;
        let about = newAbout.value;
        let gender = '';
        if (genderElement) {gender = genderElement.textContent};
        
        let profileId = makeid(16);
        let mainThings = [];
        let interests = [];
        let conversations = [];
        

        let photosIdsArray = [];
        let photosObj = [];
        for (let i = 0; i < photos.length; i++) {
            let photoId = profileId + makeid(16);
            photosIdsArray.push([photoId]);
            photosObj.push(actor.setPhoto(photoId, {
                id: [photoId],
                likes: ['0'],
                src: [photos[i].src]
            }));
        };


        
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

        log('profileID:' + profileId);
        log(mainThings);
        log(typeof mainThings);
        log(typeof mainThings[0]);
        // console.log(interests);

        // глобальный массив всех обещаний на запись данных 
        let globalPromiseArray = [];



        

        // узнаем сколько мы хотим загрузить видео, и создаем сколько нужно айдишников для видосов
        for(let i = 0; i < videosBase64Array.length; i++) {
            let randomId = makeid(16);
            videoIds.push([randomId]);
        };
        localStorage.setItem('profileVideoIds', JSON.stringify(videoIds));
        
        // console.log('VideoIds которые запушим в мотоко');
        // console.log(videoIds)
        // console.log('photosId которые запушим в мотоко')
        // console.log(photosIdsArray)
    
        let userData = {
            userData : {
                dateOfBirth : [birthDate],
                name : [name],
                profilePhotoIds: photosIdsArray,
                profileVideoIds : videoIds,
                mainPhoto: [photos[0].src],
                profileId : [profileId],
                gender : [gender],
                mainThings : mainThings,
                interests : interests,
                conversations : conversations,
                about : [about],
                profilePostIds : []
                // posts: []
            }
        };
        messageForHeart('Create new User');

        console.log(userData);


        
        let photosRes = await Promise.all(photosObj).then((data) => {return data});
        log(photosRes)

        // set videoIds
            // состовляем массив из массивов с чанками всех загруженых видео (после загрузки юзером они хранятся в videoBase64Array)
        
        for(let i = 0; i < videosBase64Array.length; i++) {
            let chunkArray = videosBase64Array[i][1].match(/.{1,1800000}/g);
            videoPreviews.push(videosBase64Array[i][0]);
            videoChunks.push(chunkArray);
        };
        console.log(videoPreviews);
        console.log(videoChunks);

        console.log('начинаем создание юзера')
        // создаем хранилища для подписок и подписчиков
        globalPromiseArray.push(actor.setSubscriptions(who.toString(), []));
        globalPromiseArray.push(actor.setSubscribers(who.toString(), []));
        // кидаем в обещания основное создание пользователя
        globalPromiseArray.push(actor.create(userData));
        await Promise.all(globalPromiseArray).then((data) => {
            console.log('Создали хранилища подписчиков и подписок а так же самого пользователя')
            console.log(data);
        });
        
        
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
                resultIds.push(resultId);
            };


            console.log('Список готовых номеров для чанков одного видео:' + resultIds);
            console.log('Количество чанков для одного видео:' + videoChunks[nowLoadedVideoNumber].length);
            // load chunks on backend
            console.log('начинаем загрузку чанков');
            // let chunkNum = 0;

            let promiseArray = [];
            // добавили к сборке обещания превью
            let videoPreviewNumber = String(videoId) + String(99);
            let videoPreviewValue = videoPreviews[nowLoadedVideoNumber];
            promiseArray.push(actor.setChunk(videoPreviewNumber, videoPreviewValue));
            console.log('presssssssss')
            console.log(videoPreviewNumber)
            console.log(videoPreviewValue)
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
};








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


setTimeout(() => {
    runRoll();
}, 1000);


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
        } else {
            let splittedDate = newDateInput.value.split('-');
            if (splittedDate[0] > 1900 && splittedDate[0] < 2020) {
                runRoll();
            } else {
                alert('wrong year of birth')
            }
            

        }
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

// обновление || загрузка фото и видео в профиле 
function onFileAdded(event, type) {
    let selectedFile = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = function(event) {
        let boxWrapper = document.querySelector('.addPhotoModal .selects');
        if (event.target.result.startsWith('data:video')) {
            
        } else {
            let idi = makeid(12);
            let newBox = `
            <div class="photoBox img" da="${idi}">
                <img class="user" src="${event.target.result}" imgId="${imgId}" alt="">
                <div class="loader-element">
                    <svg class="spinner" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                    </svg>
                </div>
            </div>
            `;
            boxWrapper.innerHTML += newBox;

            setTimeout(() => {
                let img = document.querySelector('img.user[imgId="' + imgId + '"]');
                const canvas = document.createElement('canvas');
                const width = 375;
                const scaleFactor = width / img.width;
                canvas.width = width;
                canvas.height = img.height * scaleFactor;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
                ctx.canvas.toBlob((blob) => {
                    img.src="";
                    let rea = new FileReader();
                    rea.readAsDataURL(blob);
                    rea.onloadend = function() {
                        let basee = rea.result;
                        img.src = basee;
                        let imgBoxLoader = document.querySelector('.photoBox.img[da="'+ idi +'"] .loader-element');
                        imgBoxLoader.remove();
                        if (type == 'avatar' || type == 'newPhoto') {
                            let addAvatarBtn = document.querySelector('.addPhotoModal button input.updateAvatar');
                            let addProfileBtn = document.querySelector('.addPhotoModal button input.updateGallery');
                            let sumbitBtn = document.querySelector('.addPhotoModal .uploadNewPhoto');
                            let uploadBtn = document.querySelector('.addPhotoModal button.uploadNewPhoto');
                            addAvatarBtn.parentElement.classList.remove('active');
                            addProfileBtn.parentElement.classList.remove('active');
                            sumbitBtn.classList.add('active');
                            uploadBtn.setAttribute('type', type);
                            
                        }
                    }
                }, 'image/jpeg', 0.8);
            }, 800);
        }
    };
};


// загрузка фото и видео upload photos and videos 
let imgId = 1;
let proverkaVesa = [];
function onFileSelected(event) {
    blockUpload();

    let selectedFile = event.target.files[0];

    let reader = new FileReader();
  
    
    reader.readAsDataURL(selectedFile);
    

    reader.onload = function(event2) {
        let boxWrapper = document.querySelector('.selectPhotos');
            if (event2.target.result.startsWith('data:video')) {
                let size = Math.floor(selectedFile.size / 1024 / 1024);
                if (size > 20) {
                    alert('File larger than 20 megabytes')
                } else {
                    try {
                        console.log('Это видео')
                        console.log(event2);
                        let base64video = event2.target.result;
    
        
                        // let chunkArray = base64video.match(/.{1,1800000}/g);
                        // proverkaVesa.push(chunkArray);
                        // if (proverkaVesa[0].length > 12) {
                        //     alert('The downloadable video exceeds 21 megabytes');
                        // } else {
                            
    
                            let idi = makeid(12);
                            let newBox = `
                            <div da="${idi}" class="photoBox video">
                                <div class="duration">0:00</div>
                                <canvas class="canva"></canvas>
                                <div class="loader-element">
                                    <svg class="spinner" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                                    </svg>
                                </div>
                                <img class="preview" src="">
                            </div>
                            `;
                            boxWrapper.innerHTML += newBox;
                        // }
        
                        let boxer = document.querySelector('.photoBox[da="'+ idi +'"]');
                        // <video id="video" width="123" height="240"></video>
                        let videoHtmlItem = `

                            <video id="video" width="323" height="640">
                                <source src="${base64video}">
                            </video>
                        `;
                        boxer.innerHTML += videoHtmlItem;
                        let video = boxer.querySelector('video');
                        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                            video.autoplay = true;
                        }
                            
                        // video.currentTime = 15;
        
                        
                        video.addEventListener('loadeddata', function(event) {
                            
                            let sec = this.duration;
                            let durationBox = document.querySelector('.photoBox[da="'+ idi +'"] .duration');
                            let time = Math.floor(sec / 60) + ':' + Math.floor(sec % 60);
                            durationBox.innerText = time;
        
                            const canvas = document.querySelector('.photoBox[da="'+ idi +'"] .canva');
                            canvas.width = 323;
                            canvas.height = 640;
                            const context = canvas.getContext('2d');
        
                            setTimeout(() => {
                                context.drawImage(video, 0, 0, 320, 640);
                                const dataURL = canvas.toDataURL(); // вот и ссылка с превью
                                let boxPreview = document.querySelector('.photoBox[da="'+ idi +'"] .preview');
                                boxPreview.src = dataURL;
                                videosBase64Array.push([dataURL, base64video]);
                                video.remove();
                                canvas.remove();
                                let boxPreloader = document.querySelector('.photoBox[da="'+ idi +'"] .loader-element');
                                boxPreloader.remove();
                                unBlockUpload();
                            }, 1000);
                    
                        });
                            
                    } catch(e) {
                        alert(e);
                    }
                }
                
               
                


            } else {
                // console.log(event2.target.result)
                let idi = makeid(12);
                let newBox = `
                <div class="photoBox img" da="${idi}">
                    <img class="user" src="${event2.target.result}" imgId="${imgId}" alt="">
                    <div class="loader-element">
                        <svg class="spinner" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                            <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                        </svg>
                    </div>
                </div>
                `;
                boxWrapper.innerHTML += newBox;

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
                            let imgBoxLoader = document.querySelector('.photoBox.img[da="'+ idi +'"] .loader-element');
                            imgBoxLoader.remove();
                            imgId += 1;
                            unBlockUpload();
                            
                        }
            
                    }, 'image/jpeg', 0.8);
                    
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
            if (this.classList.contains('recomendations') && this.classList.contains('main')) {runRoll();runRoll();runRoll();runRoll();runRoll();runRoll();offMessagesInterval(); loadRecomendations();}
            if (this.classList.contains('chat') && this.classList.contains('main')) {runRoll();runRoll(); getAllConversatioons(); offMessagesInterval()}
            // if (this.classList.contains('poker') && this.classList.contains('main')) {runRoll(); getAllUsers(); offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('main')) {}

            if (this.classList.contains('map') && this.classList.contains('rec')) {rollBack();rollBack();rollBack();rollBack();rollBack(); getAllUsers(); offMessagesInterval()}
            if (this.classList.contains('recomendations') && this.classList.contains('rec')) {}
            if (this.classList.contains('chat') && this.classList.contains('rec')) {rollBack();rollBack();rollBack();rollBack(); getAllConversatioons();}
            // if (this.classList.contains('poker') && this.classList.contains('users')) {}
            if (this.classList.contains('profile') && this.classList.contains('rec')) {rollBack();rollBack();rollBack();rollBack();rollBack();rollBack();getProfile(null, who)}

            if (this.classList.contains('map') && this.classList.contains('users')) {}
            if (this.classList.contains('recomendations') && this.classList.contains('users')) {runRoll();runRoll();runRoll();runRoll();runRoll();offMessagesInterval();loadRecomendations();}
            if (this.classList.contains('chat') && this.classList.contains('users')) {runRoll(); getAllConversatioons();}
            // if (this.classList.contains('poker') && this.classList.contains('users')) {}
            if (this.classList.contains('profile') && this.classList.contains('users')) {rollBack();getProfile(null, who)}


            if (this.classList.contains('map') && this.classList.contains('conversations')) {rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('recomendations') && this.classList.contains('conversations')) {runRoll();runRoll();runRoll();runRoll();offMessagesInterval();loadRecomendations();}
            if (this.classList.contains('chat') && this.classList.contains('conversations')) {offMessagesInterval()}
            // if (this.classList.contains('poker') && this.classList.contains('conversations')) {rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('conversations')) {rollBack();rollBack();offMessagesInterval();getProfile(null, who)}


            if (this.classList.contains('map') && this.classList.contains('chatWindow')) {rollBack();rollBack(); getAllUsers(); offMessagesInterval()}
            if (this.classList.contains('recomendations') && this.classList.contains('chatWindow')) {runRoll();runRoll();runRoll();offMessagesInterval();loadRecomendations();}
            if (this.classList.contains('chat') && this.classList.contains('chatWindow')) {}
            // if (this.classList.contains('poker') && this.classList.contains('chatWindow')) {rollBack();rollBack(); getAllUsers(); offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('chatWindow')) {rollBack();rollBack();rollBack(); offMessagesInterval();getProfile(null, who)}



            if (this.classList.contains('map') && this.classList.contains('otherUser')) {rollBack();rollBack();rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('recomendations') && this.classList.contains('otherUser')) {runRoll();runRoll();offMessagesInterval();loadRecomendations();}
            if (this.classList.contains('chat') && this.classList.contains('otherUser')) {rollBack();rollBack(); getAllUsers(); getAllConversatioons(); offMessagesInterval()}
            // if (this.classList.contains('poker') && this.classList.contains('otherUser')) {rollBack();rollBack();rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('otherUser')) {rollBack();rollBack();rollBack();rollBack();offMessagesInterval();getProfile(null, who)}


            if (this.classList.contains('map') && this.classList.contains('community')) {rollBack();rollBack();rollBack();rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('recomendations') && this.classList.contains('community')) {runRoll();offMessagesInterval();loadRecomendations();}
            if (this.classList.contains('chat') && this.classList.contains('community')) {rollBack();rollBack();rollBack();offMessagesInterval(); getAllConversatioons();}
            // if (this.classList.contains('poker') && this.classList.contains('otherUser')) {rollBack();rollBack();rollBack(); getAllUsers();offMessagesInterval()}
            if (this.classList.contains('profile') && this.classList.contains('community')) {rollBack();rollBack();rollBack();rollBack();rollBack();offMessagesInterval();getProfile(null, who)}
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

    let res = myMotokoObject
    console.log(res.conversations)

    if (res.conversations.length !== 0) {
        let sorted = [];
        // сортировка на повторку
        for(let i = 0; i < res.conversations.length; i++) {
            if (!sorted.includes(res.conversations[i][0])) {
                sorted.push(res.conversations[i][0]);
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
                conversationPhoto = data[0].userData.mainPhoto;
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


// async function getAllUsers() {
    
//     console.log(result);
//     renderAllUsers(result);
// };


let yearsFilter = [1,10000];
let genderFilter = 'All';

let forFilterAllUsers = [];
async function getAllUsers() {
    let allUsersWrap = document.querySelector('.allUsersWrap .allUsers');
    //отрисовка фейка 
    for(let i = 0; i < 12; i++) {
        let userItem = `
        <div class="user preload">
            <div class="userPhoto">
                <div class="preElement active" style="width: 80px; height: 80px;"></div>
            </div>
            <div class="userInfo">
                <p class="preElement active" style="width: 60px; height: 18px;"></p>
                <span class="preElement active" style="width: 20px; height: 15px; margin-top: 2px; margin-left: 21px;"></span>
            </div>
        </div>
        `;

        allUsersWrap.innerHTML += userItem;
    };

    let allUserItemsPreload = document.querySelectorAll('.allUsersWrap .allUsers .user');
    allUserItemsPreload.forEach((el) => {
        if (!el.classList.contains('preload')) {
            el.addEventListener('click', function() {
                let principal = this.getAttribute('principal');
                openUserProfile(principal);
            });
        }
    });

    let result = await actor.allUsers();
    // throw 'err'
    



    forFilterAllUsers = [];
    // сразу же перебираем результаты согласно фильтру и отдаем в фор фильтер 
    result.forEach((el) => {
        let genderStatus = false;
        let yearsStatus = false;

        // рендер без выставленных фильтров
        if (yearsFilter == [0,10000] && genderFilter == 'All') {
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

    // preloaderOff();
    
    allUsersWrap.innerHTML = "";
    forFilterAllUsers.forEach((el) => {
        // Конвертируем дату в года и выводим в профиль
        let dateNow = Date.parse(new Date());
        let birthDate = Date.parse(el[1].userData.dateOfBirth);
        let resultMs = dateNow - birthDate;
        let resultAge = Math.floor(resultMs / (1000 * 60 * 60 * 24 * 30 * 12));
        // конец вывода даты

        // находим первый айдишник фото юзера 
        let firstPhoto = el[1].userData.mainPhoto;
        console.log('ПЕРВЫЙ АЙДИ ФОТОГРАФИИ');
        console.log(firstPhoto)
        // получаем первое фото юзера

        let userItem = `
        <div class="user" principal="${el[1].id.toString()}">
        
            <div class="userPhoto">
                <img src="${firstPhoto}" alt="">
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
        // let thisUserItem = document.querySelector('.allUsersWrap .allUsers .user[principal="'+ el[1].id.toString()+ '"]');
        // console.log('наш юзер в цикле')
        // console.log(thisUserItem)
        // if (thisUserItem) {
        //     console.log('дали прослушку')
        //     console.log(thisUserItem)
        //     thisUserItem.addEventListener('click', function() {
        //         console.log('есть нажатие')
        //         let principal = this.getAttribute('principal');
        //         openUserProfile(principal);
        //     });
        // }
       
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
    // preloaderOn();
    // messageForHeart('Download user profile');
    let profilePhotosWrap = document.querySelector('.tab.user .selectPhotosWrap');
    profilePhotosWrap.innerHTML = "";
    let mainPh = document.querySelector('.tab.user .profile_information .photo_box img');
    let preEl = document.querySelector('.tab.user .profile_information .photo_box .preElement');
    mainPh.style.display = "none";
    preEl.classList.add('active');
    let subscrBtn = document.querySelector('.profileBtn.subscribe');
    subscrBtn.classList.add('block');


    if (runRolls == null) {
        runRoll();
        runRoll();
        runRoll();
    }
    if (runRolls == 1) {
        runRoll();
    }
    if (runRolls == -1) {
        rollBack();
    }

    await Promise.all([actor.getUser(principalString), actor.getSubscriptions(who.toString())]).then((data) => {
        let user = data[0];
        let mySubsriptions = data[1];
        lastViewedProfileObject = user[0].userData;
        console.log(user);
        log('запускаем функцию получения профиля');
        renderUserProfile(user[0].id, mySubsriptions);
    });
  
}



// listen subscribe Button 
let subscribeButton = document.querySelector('.tab.user .profileBtn.subscribe');
subscribeButton.addEventListener('click', async function() {
    let myPrincipalString = myPrincipal;
    let opanentPrincipalString = this.getAttribute('profilePrincipal');
    let event = this.getAttribute('event');


 
    if (event == 'unsubscribe') {
        this.classList.add('block');
        subscribeButton.querySelector('span').innerText = 'Subscribe';
        subscribeButton.setAttribute('event', 'subscribe');
        let subscriptionObj = await actor.getSubscriptions(myPrincipalString);
        let subscriberObj = await actor.getSubscribers(opanentPrincipalString);
        let freshArr = [];
        subscriptionObj[0].forEach((el) => {
            if (el !== opanentPrincipalString) {
                freshArr.push(el);
            }
        });
        let res  = await actor.setSubscriptions(myPrincipalString, freshArr);
        let freshArrOpanent = [];
        subscriberObj[0].forEach((el) => {
            if (el !== myPrincipalString) {
                freshArr.push(el);
            }
        });
        let res2 = await actor.setSubscribers(opanentPrincipalString, freshArrOpanent);
        this.classList.remove('block');
    } else {
        this.classList.add('block');
        subscribeButton.querySelector('span').innerText = 'Unsubscribe';
        subscribeButton.setAttribute('event', 'unsubscribe');
        let subscriptionObj = await actor.getSubscriptions(myPrincipalString);
        let subscriberObj = await actor.getSubscribers(opanentPrincipalString);
        // проверяем имеется ли принципал опанента в массиве если нет то добавляем 
        let boo = subscriptionObj[0].includes(opanentPrincipalString);
        console.log(boo);
        if (boo == false) {
            subscriptionObj[0].push(opanentPrincipalString);
            let res  = await actor.setSubscriptions(myPrincipalString, subscriptionObj[0]);
        }
        // проверяем имеется ли наш принципал у апонента в подписках если нет то добавляем
        let boo2 = subscriberObj[0].includes(myPrincipalString);
        if (boo2 == false) {
            subscriberObj[0].push(myPrincipalString);
            let res2 = await actor.setSubscribers(opanentPrincipalString, subscriberObj[0]);
        }
        this.classList.remove('block');

    }
  

    


});

async function renderUserProfile(principal, mySubscriptions) {
    // сразу же получаем список наших подписчиков, и если человек есть в нашем списке меняем кнопку на отписаться.
    lastViewedPrincipal = principal.toText();
    let subscriber = mySubscriptions[0].includes(principal.toText());
    if (subscriber == true) {
        console.log('подписаны')
        let subscribeButton = document.querySelector('.tab.user .profileBtn.subscribe');
        subscribeButton.querySelector('span').innerText = 'Unsubscribe';
        subscribeButton.setAttribute('event','unsubscribe');
        let subscrBtn = document.querySelector('.profileBtn.subscribe');
        subscrBtn.classList.remove('block');
    } else {
        console.log('не подписаны');
        let subscribeButton = document.querySelector('.tab.user .profileBtn.subscribe');
        subscribeButton.querySelector('span').innerText = 'Subscribe';
        subscribeButton.setAttribute('event','subscribe');
        let subscrBtn = document.querySelector('.profileBtn.subscribe');
        subscrBtn.classList.remove('block');
    }
    //
    let photo = document.querySelector('.tab.user .profile_information .photo_box img');
    // let tagAreaMain = document.querySelector('.userAreaWrap .userArea .interest .tagArea.main');
    // let tagAreaInterests = document.querySelector('.userAreaWrap .userArea .interest .tagArea.interests');
    let sendMessage = document.querySelector('.tab.user .profileBtn.sendMessage');
    // let aboutBlock = document.querySelector('.userAreaWrap .userArea .about');
    // let aboutProfile = document.querySelector('.userAreaWrap .userArea .about p');
    let mainName = document.querySelector('.tab.user .name_age_box .name');
    let subscribeButton = document.querySelector('.tab.user .profileBtn.subscribe');

    //чистим страничку блога от предыдущего пользователя
    let blogsWrap = document.querySelector('.tab.user .profileBlog .blogWrap .blogPosts');
    blogsWrap.innerHTML = "";

    // убираем прелоадер с главного фото
    let mainPh = document.querySelector('.tab.user .profile_information .photo_box img');
    let preEl = document.querySelector('.tab.user .profile_information .photo_box .preElement');
    mainPh.style.display = "block";
    preEl.classList.remove('active');

    mainName.innerText = lastViewedProfileObject.name;
    photo.src = lastViewedProfileObject.mainPhoto[0];
    
    sendMessage.setAttribute('profilePrincipal', principal.toText());
    sendMessage.setAttribute('profileId', lastViewedProfileObject.profileId);
    subscribeButton.setAttribute('profilePrincipal', principal.toText());

    let profilePhotoIds = lastViewedProfileObject.profilePhotoIds;
    let getVideoIds = lastViewedProfileObject.profileVideoIds;
    console.log('АЙДИШНИКИ ВСЕХ ФОТО ПОЛЬЗОВАТЕЛЯ');
    console.log(profilePhotoIds)
    console.log('АЙДИШНИКИ ВСЕХ ВИДЕО ПОЛЬЗОВАТЕЛЯ');
    console.log(getVideoIds);
    // собираем массив обещаний на получение фотографий
    let photosPromise = [];
    profilePhotoIds.forEach((el) => {
        photosPromise.push(actor.getPhoto(el[0]));
    });
    // получаем обещания фотографий 
    let photos = await Promise.all(photosPromise).then((data) => {return data.reverse()});
    console.log('ПОЛУЧИЛИ ВСЕ ФОТО ЮЗЕРА')
    console.log(photos)
    let profilePhotosWrap = document.querySelector('.tab.user .selectPhotosWrap');
    profilePhotosWrap.innerHTML = "";
    photos.forEach((el) => {
        let child = '<div class="child"><img class="photoChildImg" src="'+ el[0].src[0] +'" alt=""></div>';
        profilePhotosWrap.innerHTML += child;
    });
    // закончили вывод фото в профиль юзера

    // начинаем рендер видео в профиле юзера
    //собираем номера наших превьюшек видео и складываем сразу в обещание на получение превьюшек
    let previewsPromise = [];
    for(let i = 0; i < getVideoIds.length; i++) {
        previewsPromise.push(actor.getChunk(String(getVideoIds[i]) + String(99)));
    };
    const responsesPreview = await Promise.all(previewsPromise).then((data) => {
        console.log('ПРИЕХАЛИ НАШИ ПРЕВЬЮШКИ')
        console.log(data);
        return data
    });
    // convert big int to number 
    let numbersResult = [];
    for(let i = 0; i < getVideoIds.length; i++) {
        numbersResult.push(getVideoIds[i]);
    };
    //
    console.log(numbersResult);
    console.log('НОМЕРА ВИДЕО ПОЛЬЗОВАТЕЛЯ: ' + numbersResult);
    messageForHeart('Get your quantity videos');
    // УЗНАЕМ СКОЛЬКО ВИДЕО У НАС ЗАГРУЖЕНО 
    console.log('Количество наших видео:' + getVideoIds.length)
    // отображаем боксы видосов на странице 
    for(let j = 0; j < getVideoIds.length; j++) {
        // <video id="video" width="135" height="180" controls>
        //     <source src=""> 
        // </video> 
        let videoItem = `
        <div class="child video" videoId="${getVideoIds[j]}" base64="">
            <img class="videoPreview" src="${responsesPreview[j]}">
            <img class="playVideo" src="img/play_video.png">
          
        </div>
        `;
        
        profilePhotosWrap.innerHTML += videoItem;
    };
     // рендерим плееры равное количеству наших видео 
     let videoWrap = document.querySelector('.tab.user .videoModalWrap');
     videoWrap.innerHTML = '';
     for(let j = 0; j < getVideoIds.length; j++) {
         let item = `
         <video id="video" preload="auto" width="370" videoId='${getVideoIds[j]}' controls>
             <source src="">
         </video>
         `;
         videoWrap.innerHTML += item;
     };


         // получаем наши посты из блога 
         if (lastViewedProfileObject.profilePostIds.length !== 0) {
            // let postsCount = Number(lastViewedProfileObject.profilePostIds.length);
            // let opanentId = lastViewedProfileObject.profileId;

            let likesPostsArr = [];
            if (myLikesObject.length !== 0) {
                likesPostsArr = myLikesObject[0];
            }

            let promiseArr = [];
            
            for(let i = 0; i < lastViewedProfileObject.profilePostIds.length; i++) {
                promiseArr.push(actor.getPost(lastViewedProfileObject.profilePostIds[i][0]));
            };

            let postsWrap = document.querySelector('.tab.user .profileBlog .blogWrap .blogPosts');
            postsWrap.innerHTML = "";

            await Promise.all(promiseArr).then(async (data) => {
                console.log(data)

                for(let i = data.length - 1; i > -1; i--) {
                    if (data[i].length) {
                        let postItem;
                        if (data[i][0].vid.length !== 0) {
                            let opRes = await actor.getUser(data[i][0].opId[0]);
                            let origPosData = await actor.getPost(data[i][0].repOrigPostId[0]);
                            log('EROOOR')
                            log(opRes[0].userData.name);
                            log(origPosData[0].text);
                            postItem = `
                            <div class="blogPost" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}" style="flex-direction: column; padding-bottom: 0;">
                                
                                <div class="wrap">
                         
                                    <div class="info">
                                        <span style="color: rgb(65, 65, 65); font-weight: 400; font-size: 13px;">Repost</span>
                                    </div>
                                </div>
            
                                <div class="repData" style="display: flex; margin-top: 6px;">
                                    <div class="photo">
                                        <img src="${opRes[0].userData.mainPhoto[0]}">
                                    </div>
                                    <div class="info">
                                        <span>${opRes[0].userData.name[0]}</span>
                                        <p>${origPosData[0].text[0]}<p/>
                                    </div">
                                </div>
                            </div>
                        `;
                        postsWrap.innerHTML += postItem
                        } else {
                            if (likesPostsArr.includes(data[i][0].id[0])) {
                                postItem = `
                                <div class="blogPost" itemId="${data[i][0].id[0]}"  coms="${data[i][0].comments}">
                                    <div class="photo">
                                        <img src="${lastViewedProfileObject.mainPhoto}" alt="">
                                    </div>
                                    <div class="info">
                                        <span>${lastViewedProfileObject.name}</span>
                                        <p>${data[i][0].text}</p>
                                        <div class="social">
                           
                                            <div class="likes">
                                                <img class="active" itemId="${data[i][0].id[0]}" src="img/like.svg" alt="">
                                                <span>${data[i][0].likes}</span>
                                            </div>
                                            <div class="comments" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}">
                                                <img src="img/comment.svg" alt="">
                                                <span>${data[i][0].comments}</span>
                                            </div>
                                            <div class="reposts" itemId="${data[i][0].id[0]}" princ="${lastViewedPrincipal}">
                                                <img src="img/reposts.svg" alt="">
                                                <span>${data[i][0].reposts}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            } else {
                                postItem = `
                                <div class="blogPost" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}">
                                    <div class="photo">
                                        <img src="${lastViewedProfileObject.mainPhoto}" alt="">
                                    </div>
                                    <div class="info">
                                        <span>${lastViewedProfileObject.name}</span>
                                        <p>${data[i][0].text}</p>
                                        <div class="social">
              
                                            <div class="likes">
                                                <img itemId="${data[i][0].id[0]}" src="img/like.svg" alt="">
                                                <span>${data[i][0].likes}</span>
                                            </div>
                                                <div class="comments" itemId="${data[i][0].id[0]}" coms="${data[i][0].comments}">
                                                <img src="img/comment.svg" alt="">
                                                <span>${data[i][0].comments}</span>
                                            </div>
                                            <div class="reposts" itemId="${data[i][0].id[0]}" princ="${lastViewedPrincipal}">
                                                <img src="img/reposts.svg" alt="">
                                                <span>${data[i][0].reposts}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            }
                            
        
                            postsWrap.innerHTML += postItem
                        }


                    
                    }
                    
                };
                // listen likes 
                let likes = document.querySelectorAll(".tab.user .profileBlog .blogWrap .blogPosts .blogPost .info .social .likes img");
                
                likes.forEach((el) => {
                    el.addEventListener('click', function() {
                        setLike(this);
                    });
                });

                        // listen comments 
                let commentsBtn = document.querySelectorAll('.tab.user .profileBlog .blogWrap .blogPosts .blogPost .info .social .comments');
                commentsBtn.forEach((el) => {
                    el.addEventListener('click', function() {
                        let blogId = this.getAttribute('itemid');
                        let comsCount = this.getAttribute('coms');
                        openCommentsModal(this, 'user', blogId, comsCount);
                    });
                });

                // listen reposts
                let repostsBtn = document.querySelectorAll('.tab.user .profileBlog .blogWrap .blogPosts .blogPost .info .social .reposts');
                repostsBtn.forEach((el) => {
                    el.addEventListener('click', function() {
                        let blogId = this.getAttribute('itemid');
                        let princ = this.getAttribute('princ');
                        repostQuery(this, princ, blogId);
                    });
                });
           
            });
        }


    addEventListenersUserVideos();
    addEventListenersUserPhotos();
    clickAllUserVideos();
  

    




    let mainThings = lastViewedProfileObject.mainThings;
    let interests = lastViewedProfileObject.interests;
    console.log(mainThings)
    console.log(interests)
    console.log('ТАК ВЫГЛЯДИТ АБАУТ');
    console.log(lastViewedProfileObject.about)
    
    
    
    lastViewedProfilePhoto = lastViewedProfileObject.mainPhoto[0];
    lastViewedProfileName = lastViewedProfileObject.name;
    
    preloaderOff();
};




//////////////// CREATE CONVERSATION 

let sendMsgButton = document.querySelector('.tab.user .profileBtn.sendMessage');
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

  
 document.addEventListener('click', function(e) {
     log(e.target)

    // закрывашка всех дропдаунов
    dropdowns.forEach((el) => {
        el.classList.remove('open');
    });
});

let textInput = document.querySelector('.tab.chat .textarea input'); 
let send = document.querySelector('.tab.chat .textarea button');


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
            let messageText = message;
            if (message.startsWith('-=')) {
                let way;
                switch(true) {
                    case message == '-=smile=-' : way = 'img/emoji/smile.png';break;
                    case message == '-=hi=-' : way = 'img/emoji/hi.png';break;
                    case message == '-=bad=-' : way = 'img/emoji/bad.png';break;
                    case message == '-=laugh=-' : way = 'img/emoji/laugh.png';break;
                    case message == '-=like=-' : way = 'img/emoji/like.png';break;
                    case message == '-=nia=-' : way = 'img/emoji/nia.png';break;
                    case message == '-=ooh=-' : way = 'img/emoji/ooh.png';break;
                    case message == '-=rage=-' : way = 'img/emoji/rage.png';break;
                    case message == '-=super=-' : way = 'img/emoji/super.png';break;
                }
                messageText = `<img src="${way}" >`;
            }
            let messageItem = `
                <div class="message me" messageId="${messageId}">
                    <div class="photo">
                        <img src="${myPhoto}" alt="">
                    </div>
                    <div class="text">
                        <p>${messageText}</p>
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
        opanentPhoto.src = lastViewedProfilePhoto;
        opanentUpName.innerText = lastViewedProfileName;
        opanentPhotoUrl = lastViewedProfilePhoto;
    } else {
        console.log('ДАЕМ ДАННЫЕ ОПАНЕНТУ ФОТО И ИМЯ ')
        opanentPhoto.src = opanentProfileData.mainPhoto;
        opanentUpName.innerText = opanentProfileData.name;
        opanentPhotoUrl = opanentProfileData.mainPhoto;
    }
 

  


    messagesWrap.innerHTML = "";
    console.log('рендерим сообщения');
    console.log(conversationObject[0]);
    
    conversationObject[0].forEach((el) => {
        if (conversationObject[0][0] !== el) {
            let messageItem;
            console.log(myPhoto)
            let messageText = el.text;
            if (el.text[0].startsWith('-=')) {
                let way;
                switch(true) {
                    case el.text == '-=smile=-' : way = 'img/emoji/smile.png';break;
                    case el.text == '-=hi=-' : way = 'img/emoji/hi.png';break;
                    case el.text == '-=bad=-' : way = 'img/emoji/bad.png';break;
                    case el.text == '-=laugh=-' : way = 'img/emoji/laugh.png';break;
                    case el.text == '-=like=-' : way = 'img/emoji/like.png';break;
                    case el.text == '-=nia=-' : way = 'img/emoji/nia.png';break;
                    case el.text == '-=ooh=-' : way = 'img/emoji/ooh.png';break;
                    case el.text == '-=rage=-' : way = 'img/emoji/rage.png';break;
                    case el.text == '-=super=-' : way = 'img/emoji/super.png';break;
                }
                messageText = `<img src="${way}" >`;
            }
            if (el.userId == myProfId[0]) {
                messageItem = `
                    <div class="message me" messageId="${el.messageId}">
                        <div class="photo">
                            <img src="${myPhoto[0]}" alt="">
                        </div>
                        <div class="text">
                            <p>${messageText}</p>
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
                            <p>${messageText}</p>
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
                        let messageText = el.text
                        if (el.text[0].startsWith('-=')) {
                            console.log('зашли в пупи муняню')
                            let way;
                            switch(true) {
                                case el.text == '-=smile=-' : way = 'img/emoji/smile.png';break;
                                case el.text == '-=hi=-' : way = 'img/emoji/hi.png';break;
                                case el.text == '-=bad=-' : way = 'img/emoji/bad.png';break;
                                case el.text == '-=laugh=-' : way = 'img/emoji/laugh.png';break;
                                case el.text == '-=like=-' : way = 'img/emoji/like.png';break;
                                case el.text == '-=nia=-' : way = 'img/emoji/nia.png';break;
                                case el.text == '-=ooh=-' : way = 'img/emoji/ooh.png';break;
                                case el.text == '-=rage=-' : way = 'img/emoji/rage.png';break;
                                case el.text == '-=super=-' : way = 'img/emoji/super.png';break;
                            }
                            messageText = `<img src="${way}" >`;
                        }
                        let messageItem;
                        if (el.userId == myProfId[0]) {
                            messageItem = `
                                <div class="message me" messageId="${el.messageId}">
                                    <div class="photo">
                                        <img src="${myPhoto[0]}" alt="">
                                    </div>
                                    <div class="text">
                                        <p>${messageText}</p>
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
                                        <p>${messageText}</p>
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

   


   






};


    // даем прослушку верхнему блоку для перехода на профиль 
    let upBlockUser = document.querySelector('.opponent');
    upBlockUser.addEventListener('click', function() {
        let principal = this.getAttribute('principal');
        offMessagesInterval();
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





    async function openCommunity() {
        //удаление листов с подписчиками и подписками если доэтого они рендерились
        let lists = document.querySelectorAll('.mainWrapCommunity .listWrap .list');
        if (lists) {
            lists.forEach((el) => {
                el.remove();
            });
        }
        //tabs listener
        let mainTabs = document.querySelectorAll('.mainWrapCommunity .tabPanel .tab');
        mainTabs.forEach((el) => {
            el.addEventListener('click', function() {
                let tab = this.getAttribute('tab');
                mainTabs.forEach((x) => {
                    x.classList.remove('active');
                });
                this.classList.add('active');
                let contentTabs = document.querySelectorAll('.mainWrapCommunity .tabItem');
                contentTabs.forEach((y) => {
                    if (y.getAttribute('tab') == tab) {
                        y.classList.add('active');
                    } else {
                        y.classList.remove('active');
                    }
                });
            });
        });

        //render subscribers and subscriptions
        let subscriptionObj;
        let subscriberObj;
        let subscriptionObjCount;
        let subscriberObjCount;
        let promiseArr = [actor.getSubscriptions(who.toString()), actor.getSubscribers(who.toString())]
        await Promise.all(promiseArr).then((data) => {
            subscriptionObj = data[0];
            subscriberObj = data[1];
            subscriptionObjCount = data[0][0].length;
            subscriberObjCount = data[1][0].length;
        });
        console.log(subscriptionObj)
        console.log(subscriberObj)
        // выводим количество подписок и подписчиков в табы сверху 
        let subscriptionsCount = document.querySelector('.mainWrapCommunity .tabPanel .tab[tab="1"] span');
        let subscribersCount = document.querySelector('.mainWrapCommunity .tabPanel .tab[tab="2"] span');

        subscriptionsCount.innerText = 'Subscriptions ' + subscriptionObj[0].length;
        subscribersCount.innerText = 'Subscribers ' + subscriberObj[0].length;
        // собираем массив обещаний на получение данных подписок
        let subsPromises = [];
        subscriptionObj[0].forEach((el) => {
            subsPromises.push(actor.getUser(el));
        });
        //собираем массив обещаний на получение данных подписчиков
        let subsPromises2 = [];
        subscriberObj[0].forEach((el) => {
            subsPromises2.push(actor.getUser(el));
        });
        // получаем данные наших подписок 
        await Promise.all(subsPromises).then((data) => {
            console.log(data);
            let listWraps = document.querySelectorAll('.mainWrapCommunity .listWrap');
            let listElement1 = document.createElement('div');
            listElement1.classList.add('list');
            for(let i = 0; i < data.length; i++) {
                if (data[i].length !== 0) {
                    console.log('ЗАШЛИ ВОТ НАШ АЙ')
                    console.log(data[i])
                    let item = `
                    <div class="item active" principal="${data[i][0].id.toString()}">
                        <div class="photo">
                            <img src=${data[i][0].userData.mainPhoto} alt="">
                        </div>
                        <div class="name">
                            <span>${data[i][0].userData.name}</span>
                        </div>
                        <div class="button">
                            <button class="unsub">Unsubscribe</button>
                        </div>
                    </div>
                    `;
                    listElement1.innerHTML += item;
                } else {
                    // значит пользователя больше не существует мы его не вывели и должны уменьшить счетчик подписчиков на 1
                }
              
            };
            listWraps[0].appendChild(listElement1);
        });
        // получаем данные подписчиков
        await Promise.all(subsPromises2).then((data) => {
            console.log(data);
            let listWraps = document.querySelectorAll('.mainWrapCommunity .listWrap');
            let listElement1 = document.createElement('div');
            listElement1.classList.add('list');
            for(let i = 0; i < data.length; i++) {
                if (data[i].length !== 0) {
                    let item = `
                    <div class="item subscriber active" principal="${data[i][0].id.toString()}">
                        <div class="photo">
                            <img src=${data[i][0].userData.mainPhoto} alt="">
                        </div>
                        <div class="name">
                            <span>${data[i][0].userData.name}</span>
                        </div>
                        <div class="button">
                        <button class="add active">Subscribe</button>
                        <button class="remove">
                            <img src="img/del_user.svg" alt="">
                        </button>
                    </div>
                    </div>
                    `;
                    let itemWidthoutSubscribe = `
                    <div class="item subscriber active" principal="${data[i][0].id.toString()}">
                        <div class="photo">
                            <img src=${data[i][0].userData.mainPhoto} alt="">
                        </div>
                        <div class="name">
                            <span>${data[i][0].userData.name}</span>
                        </div>
                        <div class="button">
                            <button class="add">Subscribe</button>
                            <button class="remove">
                                <img src="img/del_user.svg" alt="">
                            </button>
                        </div>
                    </div>
                    `;
                    if (subscriptionObj[0].includes(data[i][0].id.toString())) {
                        listElement1.innerHTML += itemWidthoutSubscribe;
                    } else {
                        listElement1.innerHTML += item;
                    }
                    
                } else {
                    // пользователь удалился
                }
        
            };
            listWraps[1].appendChild(listElement1);
        });
        // прослушка всех айтемов подписчиков и подписок 
        // по клику переходим на профиль человека 
        let allSubsitems = document.querySelectorAll('.mainWrapCommunity .listWrap .list .item');
        allSubsitems.forEach((el) => {
            el.addEventListener('click', function() {
                let principalString = this.getAttribute('principal');
                console.log(principalString)
                openUserProfile(principalString, -1)
            });
        });
        // прослушка кнопки отписаться у каждого айтема наших подписок 
        let allUnsubbtns = document.querySelectorAll('.mainWrapCommunity .listWrap .list .item .button button.unsub');
        allUnsubbtns.forEach((el) => {
            el.addEventListener('click', async function(e) {
                e.stopPropagation();
                let opanentPrincipalString = this.parentElement.parentElement.getAttribute('principal');
                let myPrincipalString = who.toString();
                this.parentElement.parentElement.classList.remove('active');
                let subscriptionObj = await actor.getSubscriptions(myPrincipalString);
                let subscriberObj = await actor.getSubscribers(opanentPrincipalString);
                // уменьшаем счетчик подписок на 1 
                let subscriptionCount = document.querySelector('.mainWrapCommunity .tabPanel .tab[tab="1"] span');
                subscriptionObjCount = subscriptionObjCount - 1; 
                subscriptionCount.innerText = 'Subscriptions ' + subscriptionObjCount;

                let freshArr = [];
                subscriptionObj[0].forEach((el) => {
                    if (el !== opanentPrincipalString) {
                        freshArr.push(el);
                    }
                });
                let res  = await actor.setSubscriptions(myPrincipalString, freshArr);
                let freshArrOpanent = [];
                subscriberObj[0].forEach((el) => {
                    if (el !== myPrincipalString) {
                        freshArr.push(el);
                    }
                });
                let res2 = await actor.setSubscribers(opanentPrincipalString, freshArrOpanent);
                // находим этого человека в отрендереных подписчиках и добавляем кнопку подписаться
                let ourSubs = document.querySelectorAll('.mainWrapCommunity .listWrap .list .item.subscriber');
                ourSubs.forEach((el) => {
                    if (el.getAttribute('principal') == opanentPrincipalString) {
                        let subscribeBtn = el.querySelector('button.add');
                        subscribeBtn.classList.add('active');
                    }
                });
            });
        });
        // прослушка кнопки подписаться у наших подписчиков 
        let allSubsSubscribeBtns = document.querySelectorAll('.mainWrapCommunity .listWrap .list .item .button button.add');
        allSubsSubscribeBtns.forEach((el) => {
            el.addEventListener('click', async function(e) {
                e.stopPropagation();
                this.classList.remove('active');
                let opanentPrincipalString = this.parentElement.parentElement.getAttribute('principal');
                let myPrincipalString = who.toString();
                console.log(opanentPrincipalString);
                let subscriptionObj = await actor.getSubscriptions(myPrincipalString);
                let subscriberObj = await actor.getSubscribers(opanentPrincipalString);
                // проверяем имеется ли принципал опанента в массиве если нет то добавляем 
                let boo = subscriptionObj[0].includes(opanentPrincipalString);
                console.log(boo);
                // проверяем имеется ли наш принципал у апонента в подписках если нет то добавляем
                let boo2 = subscriberObj[0].includes(myPrincipalString);
                if (boo == false && boo2 == false) {
        
                    console.log('не подписаны');
                    subscriptionObj[0].push(opanentPrincipalString);
                    let res  = await actor.setSubscriptions(myPrincipalString, subscriptionObj[0]);
                    subscriberObj[0].push(myPrincipalString);
                    let res2 = await actor.setSubscribers(opanentPrincipalString, subscriberObj[0]);
                    this.classList.remove('block');
                    console.log(res)
                    console.log(res2)
                    // находим этого юзера если он уже был у нас в отрендереном списке подписок
                    // находим с списке все айтемы без класса эктив - то есть невидимых
                    let allHiddenSubscribes = document.querySelectorAll('.mainWrapCommunity .tabItem[tab="1"] .listWrap .list .item');
                    allHiddenSubscribes.forEach((el) => {
                        let itemPrincipal = el.getAttribute('principal');
                        if (itemPrincipal == opanentPrincipalString) {
                            el.classList.add('active');
                            // нашли айтем и отобразили его теперь нужно увеличить счетчик подписок на еденицу
                            let subscriptionCount = document.querySelector('.mainWrapCommunity .tabPanel .tab[tab="1"] span');
                            subscriptionObjCount = subscriptionObjCount + 1;
                            subscriptionCount.innerText = 'Subscriptions ' + subscriptionObjCount;
                        } else {
                            // не нашли айтем нужно отрисовать с нуля и добавить в каунт еденицу 
                            // добавляем в каунт еденицу 
                            let subscriptionCount = document.querySelector('.mainWrapCommunity .tabPanel .tab[tab="1"] span');
                            subscriptionObjCount = subscriptionObjCount + 1;
                            subscriptionCount.innerText = 'Subscriptions ' + subscriptionObjCount;
                            // отрисовываем свежую подписку к нам в спосок подписок 

                        }
                    });
                } else {
                    alert('you are following this user')
                }
            });
        });
        // прослушка кнопки крестика убрать из подписчиков 
        let removeSubscriberbtn = document.querySelectorAll('.mainWrapCommunity .listWrap .list .item .button button.remove');
        removeSubscriberbtn.forEach((el) => {
            el.addEventListener('click', async function(e) {
                e.stopPropagation();
                this.parentElement.parentElement.classList.remove('active');
                // уменьшаем счетчик подписок на 1 
                subscriberObjCount = subscriberObjCount - 1;
                let subscriptionCount = document.querySelector('.mainWrapCommunity .tabPanel .tab[tab="2"] span');
                subscriptionCount.innerText = 'Subscribers ' + subscriberObjCount;

                let opanentPrincipalString = this.parentElement.parentElement.getAttribute('principal');
                let myPrincipalString = who.toString();
                let subscriptionObj = await actor.getSubscriptions(opanentPrincipalString);
                let subscriberObj = await actor.getSubscribers(myPrincipalString);
                let freshArr = [];
                subscriptionObj[0].forEach((el) => {
                    if (el !== myPrincipalString) {
                        freshArr.push(el);
                    }
                });
                let res  = await actor.setSubscriptions(opanentPrincipalString, freshArr);
                let freshArrOpanent = [];
                subscriberObj[0].forEach((el) => {
                    if (el !== opanentPrincipalString) {
                        freshArr.push(el);
                    }
                });
                let res2 = await actor.setSubscribers(myPrincipalString, freshArrOpanent);
            });
        });







    }




// block upload блокировка загрузки
function blockUpload() {
    let photoBoxDefault = document.querySelector('.photo_matrix .photoBox.default');
    let createUserBtn = document.querySelector('.global_continue button.createUser');
    photoBoxDefault.classList.add('block');
    createUserBtn.classList.add('block');
}

function unBlockUpload() {
    let photoBoxDefault = document.querySelector('.photo_matrix .photoBox.default');
    let createUserBtn = document.querySelector('.global_continue button.createUser');
    photoBoxDefault.classList.remove('block');
    createUserBtn.classList.remove('block');
}


// находим все логотипы и даем прослушку на возврат к домашней странице
let allDiamonds = document.querySelectorAll('img.diamond');
allDiamonds.forEach((el) => {
    el.addEventListener('click', function() {
        let event = this.getAttribute('event');
        let value = this.getAttribute('value');

        if (event == "back") {
            for(let i = 0; i < Number(value); i++) {
                rollBack();
            };
        }
    });
});



// BLOG LISTENERS 

let sendPost = document.querySelector('.profileBlog .inputSendBlog img');
let postInput = document.querySelector('.profileBlog .inputSendBlog input');

sendPost.addEventListener('click', async function() {
    if (postInput.value !== "") {
        console.log(myMotokoObject);
        console.log(myMotokoObject.profilePostIds)

        let postId = makeid(32);
        // if (myMotokoObject.profilePostIds.length == 0) {
        //     // это первый наш пост
        //     postNumber = '0';
        // } else {
        //     // это не первый пост
        //     postNumber = String(Number(myMotokoObject.profilePostIds) + 1);
        // }
        // выводим пост на страницу 
        let postsWrap = document.querySelector('.profileBlog .blogWrap .blogPosts');

        let postItem = `
            <div class="blogPost" itemId="${postId}" coms="0">
                <div class="remove">
                    <img src="img/closed.svg">
                </div>
                <div class="photo">
                    <img src="${myMotokoObject.mainPhoto}" alt="">
                </div>
                <div class="info">
                    <span>${myMotokoObject.name}</span>
                    <p>${postInput.value}</p>
                    <div class="social">

                        <div class="likes">
                            <img src="img/like.svg" itemId="${postId}" alt="">
                            <span>0</span>
                        </div>
                        <div class="comments" itemId="${postId}" coms="0">
                        <img src="img/comment.svg" alt="">
                        <span>0</span>
                    </div>
                    <div class="reposts">
                        <img src="img/reposts.svg" alt="">
                        <span>0</span>
                    </div>
                    </div>
                </div>
            </div>
        `;

        postsWrap.insertAdjacentHTML('afterbegin', postItem);


        // listen remove
        let remove = document.querySelector(".profileBlog .blogWrap .blogPosts .blogPost[itemId='"+ postId +"'] .remove"); 
        remove.addEventListener('click', function() {
            removePost(this);
        });
        
        // listen like
        let like = document.querySelector(".profileBlog .blogWrap .blogPosts .blogPost[itemId='"+ postId +"'] .info .social .likes img");
        like.addEventListener('click', function() {
                setLike(this);
        });

        // listen comment
        let commentBtn = document.querySelector(".profileBlog .blogWrap .blogPosts .blogPost[itemId='"+ postId +"'] .info .social .comments");
        commentBtn.addEventListener('click', function() {
                let blogId = this.getAttribute('itemid');
                let comsCount = this.getAttribute('coms');
                openCommentsModal(this, null, blogId, comsCount);
        });
        

        // let postId = myMotokoObject.profileId + postNumber;
        // записываем пост в базу
        let text = postInput.value;
        postInput.value = "";
        
        
        // записываем новое количество постов в профиль
        // let freshe = myMotokoObject.profilePostIds;
        // freshe.push([postId]);

        // myMotokoObject.profilePostIds = freshe;
        
        myMotokoObject.profilePostIds.push([postId]);
        let ress = await Promise.all([actor.setPost(postId, {id: [postId], text: [text], likes: ['0'], comments: ['0'], reposts: ['0'], vid : [], opId : [], repOrigPostId: []}),actor.updateUserData(myPrincipal, {userData: myMotokoObject})]).then((data) => {return data});
        console.log(ress)
        


    }
});




async function deletePhoto(element) {
    let modal = document.querySelectorAll('.photoModal');
    modal.forEach((el) => {
        el.classList.remove('active');
    });
    let baseid = element.parentElement.getAttribute('baseid');
    let photoInProfile = document.querySelector('.tab.profile .selectPhotos .child .photoChildImg[baseid="' + baseid + '"]');
    photoInProfile.remove();
    // getProfile(null, who);
    
    myMotokoObject.profilePhotoIds.forEach((el, ind) => {
        if (el[0] == baseid) {myMotokoObject.profilePhotoIds.splice(ind, 1)}
    });
    let resultObj = {
        userData : myMotokoObject
    }
    element.classList.add('block');

    let result = await Promise.all([actor.updateUserData(myPrincipal, resultObj), actor.deletePhoto(baseid)]).then((data) => {return data});
    log(result); 
    element.classList.remove('block');
}

} catch(e) {
    alert(e);
}
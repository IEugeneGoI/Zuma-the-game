import {CanvasController} from "./MVC.js";
import {Player} from "./MVC.js";

let SPAState={};
let readyState = 0;
window.onhashchange = switchToStateFromURLHash;
    
function switchToStateFromURLHash() {
    let URLHash = window.location.hash;
    let state = URLHash.substr(1);

    if (state !== '') {
        let parts = state.split("_");
        SPAState = {pageName: parts[0]};
    } else {
        SPAState = {pageName: 'Load'};
    }

    let name = document.querySelector('h1');
    let player = document.querySelector('.player__name');
    
    let menu = document.querySelector('.game__menu');
    let play = document.querySelector('.game__levels');
    let game = document.querySelector('.game__game-play');
    let records = document.querySelector('.game__records');
    let localStorageName = localStorage.getItem('name');

    switch (SPAState.pageName) {
        case 'Menu':
            if (localStorageName) {
                player.classList.add('hidden');
                play.classList.add('hidden');
                game.classList.add('hidden');
                records.classList.add('hidden');
                menu.classList.remove('hidden');
            } else {
                name.classList.remove('hidden');
                player.classList.remove('hidden');
            }
            break;

        case 'Play':
            if (localStorageName) {
                menu.classList.add('hidden');
                game.classList.add('hidden');
                records.classList.add('hidden');
                name.classList.remove('hidden');
                play.classList.remove('hidden');
            } else {
                name.classList.remove('hidden');
                player.classList.remove('hidden');
            }
            break;

        case 'Game' :
            if (localStorage) {
                menu.classList.add('hidden');
                play.classList.add('hidden');
                records.classList.add('hidden');
                name.classList.add('hidden');
                game.classList.remove('hidden');
            } else {
                game.classList.add('hidden');
                name.classList.remove('hidden');
                player.classList.remove('hidden');
            }
            break;

        case 'Records':
            if (localStorageName) {
                menu.classList.add('hidden');
                play.classList.add('hidden');
                game.classList.add('hidden');
                name.classList.remove('hidden');
                records.classList.remove('hidden');
            } else {
                name.classList.remove('hidden');
                player.classList.remove('hidden');
            }
            break;
            
        case 'Load':
            menu.classList.add('hidden');
            play.classList.add('hidden');
            game.classList.add('hidden');
            records.classList.add('hidden');               
            name.classList.remove('hidden');
            break;
    }
}

function switchToState(newState) {
    location.hash = newState.pageName;
}

function switchToMenuPage() {
    switchToState({pageName: 'Menu'});
}

function switchToPlayPage() {
    switchToState({pageName: 'Play'});
}

function switchToGamePage() {
    switchToState({pageName: 'Game'});
}

function switchToRecordsPage() {
    switchToState({pageName: 'Records'});
}

function  run(run) {
    let oldHash = window.location.hash;

    if (readyState) {
        if (oldHash === '#Game') {
            location.hash = 'Play';
        } else if (oldHash && oldHash !== '#Game') {
            location.hash = oldHash.substr(1);
        } else {
            location.hash = 'Menu';
        }
    }

    let logo = document.querySelector('h1');
    logo.addEventListener('click', (eo) => {
        switchToMenuPage();
    });

    let buttonPlay = document.querySelector('.play__game');
    buttonPlay.addEventListener('click', () => {
        switchToPlayPage();
    });

    let buttonsLevel = document.querySelectorAll('.game__level-button');

    for (let i = 0; i < buttonsLevel.length; i++) {

        buttonsLevel[i].addEventListener('click', (eo) => {
            let div = document.getElementById('canvas');
            div.setAttribute('level', buttonsLevel[i].value);
            run();
            switchToGamePage();                
        });
    }

    let buttonRecords = document.querySelector('.table__records');
    buttonRecords.addEventListener('click', () => {
        switchToRecordsPage();
    });

    switchToStateFromURLHash();
}

function checkPlayer(records, recordsArray) {
    let form = document.forms.playerNameForm;
    let errorSpan = document.querySelector('.error__span');

    form.addEventListener('change', () => {
        errorSpan.textContent = '';
        let inputName = document.querySelector('input[name]').value;
        let same;

        for (let i = 0; i < recordsArray.length; i++) {
            if (recordsArray[i][0] === inputName) {
                errorSpan.textContent = 'Это имя уже занято! Введите другое имя';
                same = true;
            }
        }

        if (!same) {
            localStorage.setItem('name', inputName);
            localStorage.setItem('projready', '1');
            localStorage.setItem('level', '1');
            records.setPlayer();
            setTimeout(() => {
                switchToStateFromURLHash;
            }, 1000);
        }
    });
}

async function ready() {
    let myHeadersRecords = new Headers();
    myHeadersRecords.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencodedRecords = new URLSearchParams();
    urlencodedRecords.append("f", "READ");
    urlencodedRecords.append("n", "GOROHOVICH_ZUMA_RECORDS");

    let requestOptionsRecords = {
        method: 'POST',
        headers: myHeadersRecords,
        body: urlencodedRecords,
        redirect: 'follow'
    };

    let recordsArray = await fetch("https://fe.it-academy.by/AjaxStringStorage2.php", requestOptionsRecords)
        .then(response => response.json())
        .then(result => JSON.parse(result.result))
        .catch(error => console.log('error', error));

    let player = new Player();
    player.createRecords(recordsArray);

    for (let i = 0; i < recordsArray.length; i++) {
        let state = localStorage.getItem('projready');
        if (localStorage.getItem('name') !== recordsArray[i][0] && state !== '1') {
            localStorage.clear();
            location.hash = 'Menu';
        }
    }    
    
    await checkPlayer(player, recordsArray);
    
    readyState = 1;
    return SPAState;
}

ready().then(SPAState => run(start));

function start() {
    let now;
    let delta;
    let then = Date.now();
    let interval = 1000 / 62;
    let canvasController = new CanvasController();

    function work() {
        requestAnimationFrame(work);
        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            canvasController.draw();
        }
    }

    requestAnimationFrame(work);
}
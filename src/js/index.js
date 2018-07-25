import './../sass/styles.scss';
import cities from './../api/kladr.json';

import {
    HIDE,
    SHOW,
    MATCHES_COUNT,
    CSS_VISIBLE,
    CSS_HIGHLIGHTED,
    CSS_ERROR,
    CSS_ERROR_MESSAGE,
    ARROW_UP,
    ARROW_DOWN,
    ENTER,
    ESC
} from './constants.js';

let targetInput = document.getElementById('city');
let results = document.getElementById('autocomplete-results');
let message = document.getElementById('message');
let state = false;
let resultsCursor = 0;

function toggleResults(action) {
    results.classList.toggle(CSS_VISIBLE, action === SHOW);
}

function getMatches(value) {
    let matchList = [];
    let dataLength = cities.length;

    for (let i = 0; i < dataLength; i++) {
        if (cities[i].City.toLowerCase().indexOf(value.toLowerCase()) != -1) {
            matchList.push(cities[i].City);
        }
    }

    return matchList;
}

function displayMatches(matchList) {
    let matchListLength = matchList.length;

    if (matchListLength > MATCHES_COUNT) {
        createResultList(MATCHES_COUNT, matchList);
        showMessage(`Показаны  ${MATCHES_COUNT} из ${matchListLength} найденных городов. Уточните запрос, чтобы увидеть остальное.`);
    } else {
        createResultList(matchListLength, matchList);
        showMessage(`Показаны ${matchListLength} из ${matchListLength} найденных городов.`);
    }

    toggleResults(SHOW);
}

function createResultList(length, list) {
    let j = 0;
    
    while (j < length) {
        results.innerHTML += '<li class = "results">' + list[j] + '</li>';
        j++;
    }
}

function moveCursor(pos) {
    let resLength = results.children.length;

    for (let x = 0; x < resLength; x++) {
        results.children[x].classList.remove(CSS_HIGHLIGHTED);
    }

    results.children[pos].classList.add(CSS_HIGHLIGHTED);
}

function addValueMassage() {
    if ((state === false)&&(targetInput.value)) {
        showMessage('Добавьте значение в справочник или выберите другое значение из списка');
        toggleError(SHOW);

        toggleResults(HIDE);
        results.innerHTML = "";
    }
}

function showMessage(text) {
    message.innerHTML = `<li>${text}</li>`;
}

function hideMessage() {
    message.innerHTML = '';
}

function toggleError(action) {
    targetInput.classList.toggle(CSS_ERROR, action === SHOW);
    message.classList.toggle(CSS_ERROR_MESSAGE, action === SHOW);
}

function mouseChoose() {
    let moveMouse = document.querySelectorAll('.results');
    let moveMouseLength = moveMouse.length;

    for (let k = 0; k < moveMouseLength; k++) {
        moveMouse[k].onmouseover = function () {
            resultsCursor = k;

            moveCursor(resultsCursor);
        };

        moveMouse[k].onmousedown = function () {
            targetInput.value = results.children[k].innerHTML;

            resultsCursor = 0;
            state = true;

            hideMessage();
            toggleResults(HIDE);
            results.innerHTML = "";
        };
    }
}

function searchMatches(obj) {
    if (!obj.value.length > 0) {
        return false;
    }

    let matches = getMatches(obj.value);

    if (matches.length > 0) {
        displayMatches(matches);
        moveCursor(resultsCursor);
    } else {
        showMessage('Ничего не найдено!');
    }
}

targetInput.focus();

targetInput.addEventListener('keydown', function(event) {
    if (event.keyCode === ENTER) {
        event.preventDefault();
    }
});

targetInput.addEventListener('keyup', function () {
    state = false;

    hideMessage();
    toggleResults(HIDE);
    results.innerHTML = "";

    searchMatches(this);

    if (results.classList.contains(CSS_VISIBLE)) {
        switch(event.keyCode) {
            case ENTER:
                targetInput.value = results.children[resultsCursor].innerHTML;

                state = true;
                resultsCursor = 0;

                hideMessage();
                toggleResults(HIDE);
                results.innerHTML = "";

                break;
            case ARROW_UP:
                if (resultsCursor > 0) {
                    resultsCursor--;

                    moveCursor(resultsCursor);
                }

                break;
            case ARROW_DOWN:
                if (resultsCursor < MATCHES_COUNT - 1) {
                    resultsCursor++;

                    moveCursor(resultsCursor);
                }

                break;
            case ESC:
                toggleResults(HIDE);
                results.innerHTML = "";

                break;
        }
    }

    mouseChoose();
});

targetInput.addEventListener('focus', function () {
    this.select();

    toggleError(HIDE);

    message.innerHTML = '';
    targetInput.classList.add('placeholderCl');
});

targetInput.addEventListener('blur', function () {
    let list =  getMatches(targetInput.value);
    let length = list.length;

    for (let i = 0; i < length; i++) {
        if (targetInput.value.toUpperCase() === list[i].toUpperCase()) {
            targetInput.value = list[i];
            state = true;

            hideMessage();
            toggleResults(HIDE);
            results.innerHTML = "";

            break;
        }
    }

    addValueMassage();
    targetInput.classList.remove('placeholderCl');
});
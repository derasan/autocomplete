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
    ESC,
    targetInput,
    results,
    message
} from './constants.js';

let state = false;
let resultsCursor = 0;

targetInput.focus();

targetInput.addEventListener('keydown', function(event) {
    if (event.keyCode === ENTER) {
        event.preventDefault();
    }
});

targetInput.addEventListener('keyup', function () {
    let matches = [];
    state = false;

    hideMessage();
    toggleResults(HIDE);

    if (this.value.length > 0) {
        matches = getMatches(this.value);

        if (matches.length > 0) {
            displayMatches(matches);
            moveCursor(resultsCursor);
        } else {
            showMessage('Ничего не найдено!');
        }
    }

    if (results.classList.contains(CSS_VISIBLE)) {
        switch(event.keyCode) {
            case ENTER:
                targetInput.value = results.children[resultsCursor].innerHTML;

                state = true;
                resultsCursor = 0;

                hideMessage();
                toggleResults(HIDE);

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

                break;
        }
    }

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
        };
    }
});

targetInput.onfocus = function () {
    this.select();

    hideError();
    targetInput.classList.add('placeholderCl');
};

targetInput.onblur = function () {
    let list =  getMatches(targetInput.value);
    let length = list.length;

    for (let i = 0; i < length; i++) {
        if (targetInput.value.toUpperCase() === list[i].toUpperCase()) {
            targetInput.value = list[i];
            state = true;

            hideMessage();
            toggleResults(HIDE);

            break;
        }
    }

    if ((state === false)&&(targetInput.value)) {
        showMessage('Добавьте значение в справочник или выберите другое значение из списка');
        showError();

        toggleResults(HIDE);
    }

    targetInput.classList.remove('placeholderCl');
};

function toggleResults(action) {
    if (action === SHOW) {
        results.classList.add(CSS_VISIBLE);

    } else if (action === HIDE) {
        results.classList.remove(CSS_VISIBLE);
        results.innerHTML = "";
    }
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
    let j = 0;
    let matchListLength = matchList.length;

    if (matchListLength > MATCHES_COUNT) {
        while (j < MATCHES_COUNT) {
            results.innerHTML += '<li class = "results">' + matchList[j] + '</li>';
            j++;
        }

        showMessage(`Показаны  ${MATCHES_COUNT} из ${matchListLength} найденных городов. Уточните запрос, чтобы увидеть остальное.`);
    } else if (matchListLength <= MATCHES_COUNT){
        while (j < matchListLength) {
            results.innerHTML += '<li class = "results">' + matchList[j] + '</li>';
            j++;
        }

        showMessage(`Показаны ${matchListLength} из ${matchListLength} найденных городов.`);
    }
    
    toggleResults(SHOW);
}

function moveCursor(pos) {
    let resLength = results.children.length;

    for (let x = 0; x < resLength; x++) {
        results.children[x].classList.remove(CSS_HIGHLIGHTED);
    }

    results.children[pos].classList.add(CSS_HIGHLIGHTED);
}

function showMessage(text) {
    message.innerHTML = `<li>${text}</li>`;
}

function hideMessage() {
    message.innerHTML = '';
}

function showError() {
    targetInput.classList.add(CSS_ERROR);
    message.classList.add(CSS_ERROR_MESSAGE);
}

function hideError() {
    targetInput.classList.remove(CSS_ERROR);
    message.classList.remove(CSS_ERROR_MESSAGE);
    message.innerHTML = '';
}

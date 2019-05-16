import "./main.scss";
const scrollToElement = require('scroll-to-element');


function getMiddle(x1, y1, x2, y2, howFar) {
    return {
        x: ((x1 + x2) / howFar),
        y: ((y1 + y2) / howFar),
    }
}

let parties = [
    {
        letter: 'A',
        name: 'Arbeiderpartiet',
        color: 'rgb(171, 37, 33)',
    }, {
        letter: 'V',
        name: 'Venstre',
        color: 'rgb(1, 227, 27)',
    }, {
        letter: 'F',
        name: 'Fremskritspartiet',
        color: 'rgb(242, 212, 81)',
    }, {
        letter: 'K',
        name: 'Kristlig Folkeparti',
        color: 'rgb(237, 127, 26)',
    }, {
        letter: 'S',
        name: 'Socialistisk Venstreparti',
        color: 'rgb(203, 9, 109)',
    }, {
        letter: 'R',
        name: 'Rødt',
        color: 'rgb(205, 40, 27)',
    }, {
        letter: 'H',
        name: 'Høyre',
        color: 'rgb(10, 13, 230)',
    }, {
        letter: 'M',
        name: 'Miljøpartiet De Grønne',
        color: 'rgb(60, 230, 20)',
    } 
];

const wheelOfFortune = document.getElementById('wheel-of-fortune');

function createWheelOfFortune(cx, cy, r, slices) {
    parties.forEach((party, i) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        const fromAngle = i * 360 / slices;
        const toAngle = (i + 1) * 360 / slices;

        const fromCoordX = cx + (r * Math.cos(fromAngle * Math.PI / 180));
        const fromCoordY = cy + (r * Math.sin(fromAngle * Math.PI / 180));
        const toCoordX = cx + (r * Math.cos(toAngle * Math.PI / 180));
        const toCoordY = cy + (r * Math.sin(toAngle * Math.PI / 180));

        let middle1 = getMiddle(fromCoordX, fromCoordY, toCoordX, toCoordY, 2);
        let middle = getMiddle(middle1.x, middle1.y, cx, cy, 2);
        middle = getMiddle(middle.x, middle.y, middle1.x, middle1.y, 2);

        text.setAttributeNS(null, 'x', middle.x - 6);
        text.setAttributeNS(null, 'y', middle.y + 6);
        text.setAttributeNS(null, 'style', `transform: rotate(${fromAngle + 98}deg); transform-origin: ${middle.x}px ${middle.y}px;`);
        const textNode = document.createTextNode(party.letter);
        text.appendChild(textNode);
        
        const d = 'M' + cx + ',' + cy + ' L' + fromCoordX + ',' + fromCoordY + ' A' + r + ',' + r + ' 0 0,1 ' + toCoordX + ',' + toCoordY + 'z';
        path.setAttributeNS(null, "d", d);
        path.setAttributeNS(null, "fill", party.color);
        wheelOfFortune.appendChild(path);
        wheelOfFortune.appendChild(text);

        parties[i].angles = {
            start: fromAngle,
            end: toAngle,
        }

        parties[i].path = path;
    });
}

createWheelOfFortune(55, 55, 50, parties.length);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


document.querySelector('button').addEventListener('click', showWinner);

let degrees = 0;
let winnerParty;
let setIntervalId;
let setTimeoutId;
let isColored = false;
const result = document.querySelector('.result');



function showWinner() {
    if (winnerParty) {
        clearInterval(setIntervalId);
        winnerParty.path.setAttributeNS(null, "fill", winnerParty.color);
        clearTimeout(setTimeoutId);
    }
    degrees = degrees + getRandomInt(800, 2000);
    wheelOfFortune.style = `transform: rotate(${-degrees}deg);`

    winnerParty = parties.find(party => {
        if ((degrees - 90) % 360 >= party.angles.start && (degrees - 90) % 360 < party.angles.end) {
            return true;
        }
    });

    setTimeoutId = setTimeout(() => {
        setIntervalId = setInterval(() => {
            isColored = !isColored;
            isColored ? winnerParty.path.setAttributeNS(null, "fill", 'rgb(255,215,0)') : winnerParty.path.setAttributeNS(null, "fill", '#ae00ff');
        }, 300);
        isColored = !isColored;
        isColored ? winnerParty.path.setAttributeNS(null, "fill", 'rgb(255,215,0)') : winnerParty.path.setAttributeNS(null, "fill", '#ae00ff');
        
        result.innerHTML = `Gratulerer! Du skal stemme på <strong>${winnerParty.name} - ${winnerParty.letter} </strong>`;

        scrollToElement(result, {
            ease: 'out-bounce',
            duration: 400,
            offset: 1500,
        });
    }, 3000);
}




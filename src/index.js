import "./main.scss";

console.log(2);

var fromAngle, toAngle,
    fromCoordX, fromCoordY,
    toCoordX, toCoordY,
    path, d;

function getMiddle(x1, y1, x2, y2, howFar) {
    return {
        x: ((x1 + x2) / howFar),
        y: ((y1 + y2) / howFar),
    }
}

let parties = [
    {
        letter: 'A',
        name: 'Social Demokratiet',
        color: 'rgb(171, 37, 33)',
    }, {
        letter: 'V',
        name: 'Venstre',
        color: 'rgb(41, 77, 117)',
    }, {
        letter: 'O',
        name: 'Dansk Folkeparti',
        color: 'rgb(242, 212, 81)',
    }, {
        letter: 'Ø',
        name: 'Enhedslisten',
        color: 'rgb(237, 127, 26)',
    }, {
        letter: 'F',
        name: 'Socialistisk Folkeparti',
        color: 'rgb(203, 9, 109)',
    }, {
        letter: 'B',
        name: 'Radikale',
        color: 'rgb(131, 58, 147)',
    }, {
        letter: 'C',
        name: 'Konservative',
        color: 'rgb(140, 163, 35)',
    }, {
        letter: 'I',
        name: 'Liberal Alliance',
        color: 'rgb(30, 175, 183)',
    }, {
        letter: 'Å',
        name: 'Alternativet',
        color: 'rgb(42, 145, 56)',
    }, {
        letter: 'D',
        name: 'Nye Borgerlige',
        color: 'rgb(18, 124, 128)',
    }, {
        letter: 'P',
        name: 'Stram Kurs',
        color: 'rgb(153, 143, 77)',
    }, {
        letter: 'E',
        name: 'Klaus Riskær pedersen',
        color: 'rgb(108, 139, 184)',
    }, {
        letter: 'K',
        name: 'Kristen Demolraterne',
        color: 'rgb(137, 133, 113)',
    }
];

/*


*/

function createPie(cx, cy, r, slices) {

    parties.forEach((party, i) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        fromAngle = i * 360 / slices;
        toAngle = (i + 1) * 360 / slices;

        fromCoordX = cx + (r * Math.cos(fromAngle * Math.PI / 180));
        fromCoordY = cy + (r * Math.sin(fromAngle * Math.PI / 180));
        toCoordX = cx + (r * Math.cos(toAngle * Math.PI / 180));
        toCoordY = cy + (r * Math.sin(toAngle * Math.PI / 180));

        let middle1 = getMiddle(fromCoordX, fromCoordY, toCoordX, toCoordY, 2);
        let middle = getMiddle(middle1.x, middle1.y, cx, cy, 2);
        middle = getMiddle(middle.x, middle.y, middle1.x, middle1.y, 2);

        text.setAttributeNS(null, 'x', middle.x - 6);
        text.setAttributeNS(null, 'y', middle.y + 6);
        text.setAttributeNS(null, 'style', `transform: rotate(${fromAngle + 98}deg); transform-origin: ${middle.x}px ${middle.y}px;`);

        circle.setAttributeNS(null, 'cx', middle.x);
        circle.setAttributeNS(null, 'cy', middle.y);
        circle.setAttributeNS(null, 'r', 1);

        var txt = document.createTextNode(party.letter);

        text.appendChild(txt);
        d = 'M' + cx + ',' + cy + ' L' + fromCoordX + ',' + fromCoordY + ' A' + r + ',' + r + ' 0 0,1 ' + toCoordX + ',' + toCoordY + 'z';

        path.setAttributeNS(null, "d", d);
        path.setAttributeNS(null, "fill", party.color);
        document.getElementById('pie').appendChild(circle);
        document.getElementById('pie').appendChild(path);
        document.getElementById('pie').appendChild(text);

        parties[i].angles = {
            start: fromAngle,
            end: toAngle,
        }

        parties[i].path = path;
    });
}

createPie(55, 55, 50, parties.length);

console.log(parties);


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let degrees = 0;
let winnerParty;
let setIntervalId;
document.querySelector('button').addEventListener('click', () => {
    if (winnerParty) {
        clearInterval(setIntervalId);
        winnerParty.path.setAttributeNS(null, "fill", winnerParty.color);
    }
    degrees = degrees + getRandomInt(360, 2000);
    document.getElementById('pie').style = `transform: rotate(${-degrees}deg);`

    winnerParty = parties.find(party => {
        if ((degrees - 90) % 360 >= party.angles.start && (degrees - 90) % 360 < party.angles.end) {
            return true;
        }
    });

    let isColored = false;
    setTimeout(() => {
        setIntervalId = setInterval(() => {
            isColored = !isColored;
            isColored ? winnerParty.path.setAttributeNS(null, "fill", 'red') : winnerParty.path.setAttributeNS(null, "fill", 'green');
        }, 300);
        isColored = !isColored;
        isColored ? winnerParty.path.setAttributeNS(null, "fill", 'red') : winnerParty.path.setAttributeNS(null, "fill", 'green');
        
        document.querySelector('.result').innerHTML = `Tillykke du skal stemme på <strong>${winnerParty.name} - ${winnerParty.letter} </strong>`;
    }, 3000);
});


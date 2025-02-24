//reprezentace veží
let towers = {
    tower1: [],
    tower2: [7,6,5,4,3,2,1],
    tower3: []
};

//vybraný disk
let selectedDisk = null;
let selectedTower = null;

//fce pro inicializaci hry
function initGame() {
    //přidání event listenery na všechny sloupce
    document.querySelectorAll('td').forEach(tower => {
        tower.addEventListener('click', handleTowerClick);
    });
    //aktualizace cobrazení věží
    updateDisplay();

    //zobrazení pravidel
    setTimeout(() => {
        alert("Tower of Hanoi\n\nRULES:\nYou can't put bigger disk on smaller.\nYou can move only 1 disk at a time.")
    }, 100); //krátké zpoždění pro vykreslení věží 0,1s
}

//zpracování kliknutí na vež
function handleTowerClick(event) {
    const towerId = event.currentTarget.id;

    if (!selectedDisk) {
        //pokud nebyl vybrán ještě disk tak ho vybereme
        if (towers[towerId].length > 0) {
            selectedDisk = towers[towerId][towers[towerId].length - 1];
            selectedTower = towerId;
            highlightTower(towerId);
        }
    } else if (towerId === selectedTower) {
        //zrušení výběru při kliknutí na stejnou věž
        selectedDisk = null;
        selectedTower = null;
        removeHighlight();
    } else {
        //pokus přesunu disku
        if (isValidMove(selectedDisk, towers[towerId])) {
            //přesun disku
            const disk = towers[selectedTower].pop();
            towers[towerId].push(disk);

            //resetování výběru
            selectedDisk = null;
            removeHighlight();

            //Aktualizace
            updateDisplay();

            //kontrola jestli jsem nevyhrál
            if (checkWin()) {
                alert('VYHRÁL JSI');
            }
        }
    }
}

//kontrola jesli je tah praltný
function isValidMove(disk, targetTower) {
    if (targetTower.length === 0) return true;
    return disk < targetTower[targetTower.length -1];
}

//autualizace
function updateDisplay() {
    for (let towerId in towers) {
        const towerElement = document.getElementById(towerId);
        //vyčištění veže
        towerElement.innerHTML = '';

        //přidání vrcholu
        towerElement.innerHTML +=`
            <a><img src="images/vrchol.png"></a><br>
        `;

        //přidání průbehů
        for (let i = 0; i < 7 - towers[towerId].length; i++) {
            towerElement.innerHTML += `
                <a><img src="images/prubeh.png"></a><br>
            `;
        }

        //přidání disků
        for (let i = towers[towerId].length - 1; i >= 0; i--) {
            const diskSize = towers[towerId][i];
            towerElement.innerHTML +=`
                <a><img src="images/disk${diskSize}.png"></a><br>
            `;
        }
    }
}

function highlightTower(towerId) {
    document.getElementById(towerId).style.backgroundColor = 'rgba(255, 80, 168, 0.5)';
}

/* odstranění zvýraznění */
function removeHighlight() {
    document.querySelectorAll('td').forEach(tower => {
        tower.style.backgroundColor = '';
    });
}

//fungce Kontroly jestli jsem nevyhrál
function checkWin() {
    return towers.tower3.length === 7 &&
           towers.tower3.every((disk, index, array) => disk > (array[index - 1] || 0));
}

//spuštění hry při naštení stránky
window.onload = initGame;
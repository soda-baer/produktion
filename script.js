unction generateUniqueID() {
    return '_' + Math.random().toString(36).substr(2, 9); // Beispiel für eine zufällige ID
}

function zieleSpeichern() {
    var selectedDay = document.getElementById("tagAuswahl").value;
    var selectedZeitfenster = document.getElementById("zeitfensterAuswahl").value;
    var zielWert = document.getElementById("zielEingabe").value;

    var storedEvents = JSON.parse(localStorage.getItem(selectedDay)) || {};
    var completedEvents = JSON.parse(localStorage.getItem(selectedDay + '_completed')) || {};

    // Eindeutige ID für das neue Ereignis erstellen
    var uniqueID = generateUniqueID(); // Funktion, um eine eindeutige ID zu erstellen

    // Löschen des alten Ereignisses, falls es existiert
    delete storedEvents[selectedZeitfenster];

    // Hinzufügen des neuen Ereignisses mit der eindeutigen ID
    storedEvents[selectedZeitfenster] = { id: uniqueID, description: zielWert };
    completedEvents[uniqueID] = false; // Fertigstellungsstatus auf "false" setzen

    localStorage.setItem(selectedDay, JSON.stringify(storedEvents));
    localStorage.setItem(selectedDay + '_completed', JSON.stringify(completedEvents));

    alert("Ziel gespeichert für " + selectedDay + ", Zeitfenster: " + selectedZeitfenster + ", Ziel: " + zielWert);

    anzeigenGespeicherterZiele();
	
	return uniqueID;
}


function anzeigenGespeicherterZiele() {
    var zieleContainer = document.getElementById("gespeicherteZiele");
    zieleContainer.innerHTML = "";

    function createDeleteButton(selectedDay, index) {
        var deleteButton = document.createElement('span');
        deleteButton.textContent = "  X"; // Setze das rote X als Textinhalt
        deleteButton.classList.add("deleteButton");
        deleteButton.onclick = function() {
            var storedEvents = JSON.parse(localStorage.getItem(selectedDay));
            storedEvents.splice(index, 1);
            localStorage.setItem(selectedDay, JSON.stringify(storedEvents));
            anzeigenGespeicherterZiele();
        };
        return deleteButton;
    }

    ['Heute', 'Morgen'].forEach(function(selectedDay) {
        var storedEvents = JSON.parse(localStorage.getItem(selectedDay)) || [];
        if (storedEvents.length > 0) {
            var dayHeader = document.createElement('h2');
            dayHeader.textContent = selectedDay;
            zieleContainer.appendChild(dayHeader);

            storedEvents.forEach(function(event, index) {
                var zielElement = document.createElement('div');
                zielElement.textContent = event.zeitfenster + ": " + event.description;
                zielElement.appendChild(createDeleteButton(selectedDay, index));
                zieleContainer.appendChild(zielElement);
            });
        }
    });
}

function tagWechselPruefen() {
    // Hier prüfst du, ob der Tag gewechselt hat, z.B. anhand der Uhrzeit

    // Beispiel: Wenn es nach Mitternacht ist
    var jetzt = new Date();
    if (jetzt.getHours() === 23 && jetzt.getMinutes() === 01) {
        tagWechselDurchfuehren();
    }
}

function tagWechselDurchfuehren() {
    // Ereignisse von "Heute" löschen
    localStorage.removeItem('Heute');

    // Ereignisse von "Morgen" als "Heute" übernehmen
    var storedEventsMorgen = JSON.parse(localStorage.getItem('Morgen')) || [];
    localStorage.setItem('Heute', JSON.stringify(storedEventsMorgen));
	localStorage.removeItem('Morgen');

    // Eventuell weitere notwendige Aktionen oder Benachrichtigungen ausführen
}

// Diese Funktion könnte regelmäßig ausgeführt werden, z.B. im Intervall oder bei Bedarf
setInterval(tagWechselPruefen, 60000); // Zum Beispiel alle Minute prüfen

window.onload = function() {
    anzeigenGespeicherterZiele();
};

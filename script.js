// Initialisiere Firebase
const firebaseConfig = {
	apiKey: "AIzaSyAeLlMTpy-epnicTIajhYY6jSn-4Amm2-E",
    authDomain: "produktionszieledb.firebaseapp.com",
    projectId: "produktionszieledb",
    storageBucket: "produktionszieledb.appspot.com",
    messagingSenderId: "1051974021423",
    appId: "1:1051974021423:web:a308b7c94e10188322b1da"
};

// Initialisiere Firebase
firebase.initializeApp(firebaseConfig);

// Eine Referenz auf die Firebase-Datenbank erhalten
const db = firebase.firestore();

// Funktion zum Speichern von Zielen in Firebase
function zieleSpeichern() {
  var selectedDay = document.getElementById("tagAuswahl").value;
  var selectedZeitfenster = document.getElementById("zeitfensterAuswahl").value;
  var zielWert = document.getElementById("zielEingabe").value;

  // Daten zum Speichern in Firebase vorbereiten
  var data = {
    id: generateUniqueID(),
    description: zielWert,
    completed: false // Angenommen, dass dies die Standardeinstellung ist
  };

  // Eine Referenz auf die Sammlung für den ausgewählten Tag erstellen
  var collectionRef = db.collection(selectedDay);

  // Ein neues Dokument in der Sammlung mit der eindeutigen ID erstellen
  collectionRef.doc(selectedZeitfenster).set(data)
    .then(function() {
      alert("Ziel gespeichert für " + selectedDay + ", Zeitfenster: " + selectedZeitfenster + ", Ziel: " + zielWert);
      anzeigenGespeicherterZiele();
    })
    .catch(function(error) {
      console.error("Fehler beim Speichern des Ziels: ", error);
    });
}

// Funktion zum Anzeigen gespeicherter Ziele aus Firebase
function anzeigenGespeicherterZiele() {
  var zieleContainer = document.getElementById("gespeicherteZiele");
  zieleContainer.innerHTML = "";

  // Annahme: 'Heute' und 'Morgen' sind die Sammlungen in der Datenbank
  ['Heute', 'Morgen'].forEach(function(selectedDay) {
    var collectionRef = db.collection(selectedDay);

    // Dokumente aus der Sammlung abrufen und anzeigen
    collectionRef.get().then(function(querySnapshot) {
      if (!querySnapshot.empty) {
        var dayHeader = document.createElement('h2');
        dayHeader.textContent = selectedDay;
        zieleContainer.appendChild(dayHeader);

        querySnapshot.forEach(function(doc) {
          var zielElement = document.createElement('div');
          zielElement.textContent = doc.id + ": " + doc.data().description;
          zieleContainer.appendChild(zielElement);
        });
      }
    }).catch(function(error) {
      console.error("Fehler beim Abrufen der Ziele: ", error);
    });
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

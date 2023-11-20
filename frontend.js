// Import der Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Konfiguration für Firebase
const firebaseConfig = {
	apiKey: "AIzaSyAeLlMTpy-epnicTIajhYY6jSn-4Amm2-E",
    authDomain: "produktionszieledb.firebaseapp.com",
    projectId: "produktionszieledb",
    storageBucket: "produktionszieledb.appspot.com",
    messagingSenderId: "1051974021423",
    appId: "1:1051974021423:web:a308b7c94e10188322b1da"
};

// Initialisierung der Firebase-App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.onload = async function() {
  // Funktion zum Anzeigen der Ereignisse für einen bestimmten Tag aus Firebase
  async function displayEventsForDay(selectedDay) {
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.innerHTML = '';

    try {
      const eventCollection = collection(db, selectedDay);
      const querySnapshot = await getDocs(eventCollection);

      querySnapshot.forEach((doc) => {
        const event = doc.data();
        const eventId = doc.id;

        const eventBox = document.createElement('div');
        eventBox.classList.add('event-item');
        eventBox.id = eventId;

        const eventText = document.createElement('p');
        eventText.textContent = eventId + ": " + event.description;

        eventBox.appendChild(eventText);

        // Hier kannst du je nach Bedarf die Klasse 'completed' hinzufügen

        eventsContainer.appendChild(eventBox);
      });
    } catch (error) {
      console.error("Fehler beim Abrufen der Ereignisse:", error);
    }

    document.getElementById('currentDay').textContent = "Produktionsereignisse für " + selectedDay;
  }

  // Funktion zum Anzeigen der Ereignisse für den aktuellen Tag
  var currentDay = 'Heute';
  displayEventsForDay(currentDay);

  // Funktion zum Wechseln zwischen 'Heute' und 'Morgen'
  function showNextDay() {
    currentDay = (currentDay === 'Heute') ? 'Morgen' : 'Heute';
    displayEventsForDay(currentDay);
  }

  document.getElementById('nextDayButton').onclick = function() {
    showNextDay();
  };
};
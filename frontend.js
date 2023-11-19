window.onload = function() {
    function displayEventsForDay(selectedDay) {
        var storedEvents = JSON.parse(localStorage.getItem(selectedDay)) || {};
        var completedEvents = JSON.parse(localStorage.getItem(selectedDay + '_completed')) || {};

        var eventsContainer = document.getElementById('eventsContainer');
        eventsContainer.innerHTML = '';

        Object.keys(storedEvents).forEach(function(timeSlot) {
            var event = storedEvents[timeSlot];
            var eventId = event.id;

            var eventBox = document.createElement('div');
            eventBox.classList.add('event-item');
            eventBox.id = eventId;

            var eventText = document.createElement('p');
            eventText.textContent = timeSlot + ": " + event.description;

            eventBox.appendChild(eventText);

            if (completedEvents[eventId]) {
                eventBox.classList.add('completed');
            }

            eventsContainer.appendChild(eventBox);

            if (!completedEvents[eventId]) {
                eventBox.classList.add('not-completed');
                createFinishButton(eventId, selectedDay);
            }
        });

        document.getElementById('currentDay').textContent = "Produktionsereignisse für " + selectedDay;
    }

    var currentDay = 'Heute';
    displayEventsForDay(currentDay);

    function createFinishButton(eventId, selectedDay) {
        var finishButton = document.createElement('button');
        finishButton.textContent = "Fertiggestellt";
        finishButton.onclick = function() {
            var completedEvents = JSON.parse(localStorage.getItem(selectedDay + '_completed')) || {};
            completedEvents[eventId] = true;
            localStorage.setItem(selectedDay + '_completed', JSON.stringify(completedEvents));

            var eventBox = document.getElementById(eventId);
            eventBox.classList.remove('not-completed');
            eventBox.classList.add('completed');
        };
        document.getElementById(eventId).appendChild(finishButton);
    }


    var currentDay = 'Heute';
    displayEventsForDay(currentDay);

    function createFinishButton(eventId, selectedDay) {
		var finishButton = document.createElement('button');
		finishButton.textContent = "Fertiggestellt";
		finishButton.onclick = function() {
			var completedEvents = JSON.parse(localStorage.getItem(selectedDay + '_completed')) || {};
			completedEvents[eventId] = true;
			localStorage.setItem(selectedDay + '_completed', JSON.stringify(completedEvents));
			
			console.log('Aktualisierte completedEvents:', completedEvents);

			var eventBox = document.getElementById(eventId);
			eventBox.classList.remove('current');
			eventBox.classList.add('completed');

			var nextEvent = eventBox.nextElementSibling;
			if (nextEvent) {
				nextEvent.classList.add('current');
				createFinishButton(nextEvent.id, selectedDay);
			}
		};
		document.getElementById(eventId).appendChild(finishButton);

		// Check if the event is already completed and apply the completed class
		var completedEvents = JSON.parse(localStorage.getItem(selectedDay + '_completed')) || {};
		if (completedEvents[eventId]) {
			var eventBox = document.getElementById(eventId);
			eventBox.classList.remove('current');
			eventBox.classList.add('completed');
		}
	}

    function showNextDay() {
        currentDay = (currentDay === 'Heute') ? 'Morgen' : 'Heute';
        displayEventsForDay(currentDay);
    }

    document.getElementById('nextDayButton').onclick = function() {
        showNextDay();
    };
};

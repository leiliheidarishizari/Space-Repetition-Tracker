import { sampleData } from './userData.js'; // Import mock data from userData.js
import { getUserIds, getData, addData } from './storage.js'; // Import storage functions from storage.js

let currentUserId = "1";  // Default user (User 1)

/**
 * Function to initialize localStorage with mock data for each user.
 */
function initializeLocalStorage() {
    getUserIds().forEach(userId => {
        if (!getData(userId)) {  // If no data is found for this user in localStorage
            addData(userId, sampleData[userId]); // Add mock data for the user
        }
    });
}

/**
 * Function to display the user's agenda
 * @param {string} userId - The ID of the user
 */
function displayAgenda(userId) {
    const agenda = getData(userId); // Get the agenda from localStorage
    console.log('Displaying agenda for user', userId, agenda);  // Debugging log

    const agendaContainer = document.getElementById("agendaContainer");
    agendaContainer.innerHTML = '';  // Clear existing agenda content

    if (!agenda || agenda.length === 0) {
        agendaContainer.innerHTML = `<p>No agenda for user ${userId}</p>`;
        return;
    }

    agenda.forEach((item, index) => {
        const topic = item.topic || 'No topic provided';
        const date = item.date || 'No date provided';

        agendaContainer.innerHTML += `
            <p>${index + 1}. Topic: ${topic}, Date: ${date}</p>
        `;
    });
}

/**
 * Handle form submission to add a new agenda item for the current user.
 * @param {Event} event - The form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const topic = document.getElementById("topicInput").value;
    const date = document.getElementById("dateInput").value;

    if (!topic || !date) {
        alert("Please fill in both fields.");
        return;
    }

    const newAgendaItem = { topic, date };
    console.log('Adding new agenda item', newAgendaItem);  // Debugging log

    // Add new agenda item for the current user
    addData(currentUserId, [newAgendaItem]);  // Add new agenda to the user's data

    // Clear the form fields
    document.getElementById("topicInput").value = '';
    document.getElementById("dateInput").value = '';

    // Refresh the displayed agenda
    displayAgenda(currentUserId);
}

/**
 * Setup the user selection dropdown and default agenda
 */
function setupUserSelection() {
    const userSelect = document.getElementById("userSelect");
    
    // Populate dropdown with all user IDs
    getUserIds().forEach(userId => {
        const option = document.createElement("option");
        option.value = userId;
        option.textContent = `User ${userId}`;
        userSelect.appendChild(option);
    });

    userSelect.value = currentUserId;  // Set default user
    userSelect.addEventListener("change", (event) => {
        currentUserId = event.target.value;
        displayAgenda(currentUserId);  // Show the selected user's agenda
    });
}

/**
 * Initialize the page with the default user and setup event listeners.
 */
function init() {
    // Initialize localStorage with mock data
    initializeLocalStorage();

    // Set default date in the form
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    document.getElementById("dateInput").value = today;

    // Display the agenda for the default user
    displayAgenda(currentUserId);

    // Setup the user selection dropdown
    setupUserSelection();

    // Add event listener for the form submission
    const form = document.getElementById("agendaForm");
    form.addEventListener("submit", handleFormSubmit);
}

// Initialize the page when it loads
window.onload = init;






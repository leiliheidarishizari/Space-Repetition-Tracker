
import { getData, addData, clearData } from './storage.js';  // Import storage functions
import { users } from './userData.js';  // Import user data
// window.onload = function(){
//   clearData(2)
// }

const userDropdown = document.getElementById("userDropdown");
const agendaList = document.getElementById("agendaList");
const searchBar = document.getElementById("searchBar");
const topicForm = document.getElementById("topicForm");
const topicName = document.getElementById("topicName");
const datePicker = document.getElementById("datePicker");

// Populate the dropdown with user names
users.forEach(user => {
  const option = document.createElement("option");
  option.value = user.id;
  option.textContent = user.name;
  userDropdown.appendChild(option);

  // If there's no agenda in localStorage, populate it
  const storedAgenda = getData(user.id);
  if (!storedAgenda || storedAgenda.length === 0) {
    addData(user.id, user.agenda);
  }
});

// Set the default user to Leili (first in the list)
userDropdown.value = users[0].id;
displayAgenda(userDropdown.value);

// Set the default date to today
const today = new Date().toISOString().split("T")[0];
datePicker.value = today;
// Display agenda for a specific user
function displayAgenda(userId) {
  agendaList.innerHTML = ""; // Clear previous agenda items
  const userAgenda = getData(userId);

  if (userAgenda && userAgenda.length > 0) {
    userAgenda.forEach((item) => {
      if (typeof item === "object" && item.topic && item.revisionDates) {
        item.revisionDates.forEach((date) => {
          const revisionDate = new Date(date);
          const today = new Date();

          if (revisionDate >= today) {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.topic}, ${formatDate(date)}`;
            agendaList.appendChild(listItem);
          }
        });
      } else {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        agendaList.appendChild(listItem);
      }
    });
  } else {
    const message = document.createElement("li");
    message.textContent = "No agenda found for this user.";
    message.setAttribute("role", "alert");
    agendaList.appendChild(message);
  }
}

// Helper function to format dates in a readable format
function formatDate(date) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

// Event listener to update agenda when a user is selected
userDropdown.addEventListener("change", function() {
  const selectedUserId = userDropdown.value;
  displayAgenda(selectedUserId);
});

// Implement search functionality for agenda items
searchBar.addEventListener("input", function() {
  const searchTerm = searchBar.value.toLowerCase();
  const agendaItems = document.querySelectorAll("#agendaList li");

  agendaItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? "" : "none";
  });
});

// Event listener for form submission to add a new topic
topicForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  const topic = topicName.value.trim();
  const selectedDate = datePicker.value;

  if (topic && selectedDate) {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate < today) {
      alert("Please select a date in the future.");
      return;
    }

    // Calculate the revision dates
    const revisionDates = calculateRevisionDates(selectedDate);

    // Create the new agenda item
    const newAgendaItem = { topic, revisionDates };

    // Get the selected user and store the data
    const selectedUserId = userDropdown.value;
    addData(selectedUserId, [newAgendaItem]); // Store as an array

    // Clear form and reset date picker to today
    topicName.value = "";
    datePicker.value = today;
    displayAgenda(selectedUserId);
  }
});

 function calculateRevisionDates(startDate) {
  const intervals = [
    { days: 7 }, // 1 week
    { months: 1 }, // 1 month
    { months: 3 }, // 3 months
    { months: 6 }, // 6 months
    { years: 1 }, // 1 year
  ];

  return intervals.map((interval) => {
    const revisionDate = new Date(startDate);

    if (interval.days) {
      revisionDate.setDate(revisionDate.getDate() + interval.days);
    } else if (interval.months) {
      revisionDate.setMonth(revisionDate.getMonth() + interval.months);
    } else if (interval.years) {
      revisionDate.setFullYear(revisionDate.getFullYear() + interval.years);
    }

    // Handle edge cases for months with fewer days
    const maxDay = new Date(
      revisionDate.getFullYear(),
      revisionDate.getMonth() + 1,
      0
    ).getDate();
    if (revisionDate.getDate() > maxDay) {
      revisionDate.setDate(maxDay);
    }

    return revisionDate.toISOString().split("T")[0];
  });
}

// Function to check if the topic already exists for the user
function isTopicDuplicate(userId, newTopic) {
  const existingData = getData(userId) || []; // Fetch the current user's data
  
  // Check if a topic with the same name and date already exists (considering the revision dates)
  return existingData.some(topic => 
    topic.topicName === newTopic.topicName && 
    topic.date === newTopic.date &&
    JSON.stringify(topic.revisionDates) === JSON.stringify(newTopic.revisionDates)
  );
}
module.exports = { calculateRevisionDates };

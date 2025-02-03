import { getData, addData } from './storage.js';  // Import storage functions
import { users } from './userData.js';  // Import user data

const userDropdown = document.getElementById("userDropdown");
const agendaList = document.getElementById("agendaList");
const searchBar = document.getElementById("searchBar");

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

// Display agenda for a specific user
function displayAgenda(userId) {
  agendaList.innerHTML = "";  // Clear any previous agenda items
  const userAgenda = getData(userId);

  if (userAgenda && userAgenda.length > 0) {
    userAgenda.forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      agendaList.appendChild(listItem);
    });
  } else {
    const message = document.createElement("li");
    message.textContent = "No agenda found for this user.";
    agendaList.appendChild(message);
  }
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

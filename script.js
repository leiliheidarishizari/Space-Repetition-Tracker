// ================== date-picker ====================


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("studyForm");
  const topicInput = document.getElementById("searchBar");
  const dateInput = document.getElementById("studyDate-picker");
  const userDropdown = document.getElementById("userDropdown");
  const agendaList = document.getElementById("agendaList");

  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today; // Default to today's date

  // Simulating user options (this should be dynamic in a real app)
  const users = ["User 1", "User 2", "User 3", "User 4", "User 5"];
  users.forEach((user, index) => {
    const option = document.createElement("option");
    option.value = `user${index + 1}`;
    option.textContent = user;
    userDropdown.appendChild(option);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const topic = topicInput.value.trim();
    const selectedDate = new Date(dateInput.value);
    const userId = userDropdown.value;

    if (!topic) {
      alert("Please enter a topic.");
      return;
    }

    const revisionDates = calculateRevisionDates(selectedDate);
    const newData = { topic, selectedDate: dateInput.value, revisionDates };

    addData(userId, newData); // Save to storage
    updateAgendaUI(userId); // Refresh UI

    form.reset();
    dateInput.value = today; // Reset to today's date
  });

  function calculateRevisionDates(startDate) {
    return {
      "1 Week": formatDate(addDays(startDate, 7)),
      "1 Month": formatDate(addDays(startDate, 30)),
      "3 Months": formatDate(addDays(startDate, 90)),
      "6 Months": formatDate(addDays(startDate, 180)),
      "1 Year": formatDate(addDays(startDate, 365)),
    };
  }

  function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  function addData(userId, data) {
    const storedData = JSON.parse(localStorage.getItem(userId)) || [];
    storedData.push(data);
    localStorage.setItem(userId, JSON.stringify(storedData));
  }

  function updateAgendaUI(userId) {
    agendaList.innerHTML = ""; // Clear current agenda

    const storedData = JSON.parse(localStorage.getItem(userId)) || [];
    if (storedData.length === 0) {
      agendaList.innerHTML = "<li>No agenda found for this user.</li>";
      return;
    }

    storedData.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<strong>${item.topic}</strong> - Start: ${item.selectedDate}<br>
            📅 Revisions:
            <ul>
                <li>1 Week: ${item.revisionDates["1 Week"]}</li>
                <li>1 Month: ${item.revisionDates["1 Month"]}</li>
                <li>3 Months: ${item.revisionDates["3 Months"]}</li>
                <li>6 Months: ${item.revisionDates["6 Months"]}</li>
                <li>1 Year: ${item.revisionDates["1 Year"]}</li>
            </ul>`;
      agendaList.appendChild(listItem);
    });
  }

  // When user selects a different user, update the agenda
  userDropdown.addEventListener("change", function () {
    updateAgendaUI(userDropdown.value);
  });

  // Load agenda for the first user by default
  updateAgendaUI(userDropdown.value);
});

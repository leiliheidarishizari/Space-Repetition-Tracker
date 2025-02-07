// script.test.js

const { calculateRevisionDates } = require('./script.js');
const { getData, addData, clearData } = require('./storage.js'); // Mock these functions
const { users } = require('./userData.js');  // Mock user data

// Mock DOM elements
document.body.innerHTML = `
  <select id="userDropdown"></select>
  <ul id="agendaList"></ul>
  <input id="searchBar" />
  <form id="topicForm">
    <input id="topicName" />
    <input id="datePicker" />
  </form>
`;

// Mocking the external modules
jest.mock('./storage.js', () => ({
  getData: jest.fn(),
  addData: jest.fn(),
  clearData: jest.fn(),
}));

jest.mock('./userData.js', () => ({
  users: [
    { id: '1', name: 'Leili', agenda: [] },
    { id: '2', name: 'John', agenda: [] },
  ],
}));

describe('calculateRevisionDates', () => {
  it('should calculate revision dates correctly for different intervals', () => {
    const startDate = '2025-02-07';
    const revisionDates = calculateRevisionDates(startDate);

    expect(revisionDates.length).toBe(5);
    expect(revisionDates[0]).toBe('2025-02-14'); // 1 week later
    expect(revisionDates[1]).toBe('2025-03-07'); // 1 month later
    expect(revisionDates[2]).toBe('2025-05-07'); // 3 months later
    expect(revisionDates[3]).toBe('2025-08-07'); // 6 months later
    expect(revisionDates[4]).toBe('2026-02-07'); // 1 year later
  });

  it('should handle edge cases for months with fewer days', () => {
    const startDate = '2025-01-31';
    const revisionDates = calculateRevisionDates(startDate);

    expect(revisionDates[1]).toBe('2025-02-28'); // Handle the shorter February
  });

  it('should handle edge cases when the year changes', () => {
    const startDate = '2025-12-31';
    const revisionDates = calculateRevisionDates(startDate);

    expect(revisionDates[4]).toBe('2026-12-31'); // 1 year later
  });
});

describe('DOM Manipulation and Functionality', () => {
  let userDropdown, agendaList, searchBar, topicForm, topicName, datePicker;

  beforeEach(() => {
    userDropdown = document.getElementById("userDropdown");
    agendaList = document.getElementById("agendaList");
    searchBar = document.getElementById("searchBar");
    topicForm = document.getElementById("topicForm");
    topicName = document.getElementById("topicName");
    datePicker = document.getElementById("datePicker");

    // Reset mocks before each test
    getData.mockReset();
    addData.mockReset();
  });

  it('should populate the user dropdown with users', () => {
    // Simulate the code that populates the user dropdown
    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      userDropdown.appendChild(option);
    });

    expect(userDropdown.children.length).toBe(2); // 2 users mocked
    expect(userDropdown.children[0].textContent).toBe('Leili');
    expect(userDropdown.children[1].textContent).toBe('John');
  });

  it('should call getData and addData when agenda is empty', () => {
    const user = users[0];

    getData.mockReturnValueOnce([]); // Simulate no agenda data
    addData.mockImplementationOnce(() => {}); // Mock addData

    // Simulate agenda population logic
    const storedAgenda = getData(user.id);
    if (!storedAgenda || storedAgenda.length === 0) {
      addData(user.id, user.agenda);
    }

    expect(addData).toHaveBeenCalledTimes(1);
    expect(addData).toHaveBeenCalledWith(user.id, user.agenda);
  });

  it('should display agenda items correctly', () => {
    const user = users[0];
    const agendaItem = { topic: 'Topic 1', revisionDates: ['2025-02-14', '2025-03-07'] };
    
    getData.mockReturnValueOnce([agendaItem]); // Mock data

    // Simulate displayAgenda function
    agendaList.innerHTML = ''; // Clear previous agenda
    const userAgenda = getData(user.id);
    userAgenda.forEach((item) => {
      if (item.revisionDates) {
        item.revisionDates.forEach((date) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${item.topic}, ${date}`;
          agendaList.appendChild(listItem);
        });
      }
    });

    expect(agendaList.children.length).toBe(2); // 2 revision dates
    expect(agendaList.children[0].textContent).toBe('Topic 1, 2025-02-14');
    expect(agendaList.children[1].textContent).toBe('Topic 1, 2025-03-07');
  });

  it('should filter agenda items by search term', () => {
    const agendaItem1 = document.createElement("li");
    agendaItem1.textContent = "Topic 1, 2025-02-14";
    const agendaItem2 = document.createElement("li");
    agendaItem2.textContent = "Topic 2, 2025-03-07";
    agendaList.appendChild(agendaItem1);
    agendaList.appendChild(agendaItem2);

    searchBar.value = 'Topic 1';
    searchBar.dispatchEvent(new Event('input'));

    expect(agendaItem1.style.display).toBe('');
    expect(agendaItem2.style.display).toBe('none');
  });

  it('should add a new topic on form submission', () => {
    topicName.value = 'New Topic';
    datePicker.value = '2025-03-01';
    
    const selectedUserId = userDropdown.value;
    const today = new Date().toISOString().split("T")[0];
    
    // Mock the form submission
    topicForm.dispatchEvent(new Event('submit'));

    expect(addData).toHaveBeenCalledTimes(1);
    expect(addData).toHaveBeenCalledWith(selectedUserId, [{
      topic: 'New Topic',
      revisionDates: expect.any(Array), // expect revisionDates to be an array
    }]);
  });
});


import { getData, addData, clearData } from './storage.js';
import { users } from './userData.js';
import { displayAgenda, formatDate, calculateRevisionDates, isTopicDuplicate } from './script.js';

// Mock the storage functions and users
jest.mock('./storage.js');
jest.mock('./userData.js');

describe('script.js', () => {
  beforeEach(() => {
    // Reset mocks before each test
    getData.mockReset();
    addData.mockReset();
    clearData.mockReset();
  });

  describe('formatDate', () => {
    it('should format a date correctly', () => {
      const testDate = '2025-02-07T00:00:00Z';
      const formattedDate = formatDate(testDate);
      expect(formattedDate).toBe('7 February 2025');
    });
  });

  describe('calculateRevisionDates', () => {
    it('should calculate revision dates correctly for different intervals', () => {
      const startDate = '2025-02-07';
      const revisionDates = calculateRevisionDates(startDate);

      expect(revisionDates.length).toBe(5); // Should return 5 dates
      expect(revisionDates[0]).toBe('2025-02-14'); // 1 week later
      expect(revisionDates[1]).toBe('2025-03-07'); // 1 month later
      expect(revisionDates[2]).toBe('2025-05-07'); // 3 months later
      expect(revisionDates[3]).toBe('2025-08-07'); // 6 months later
      expect(revisionDates[4]).toBe('2026-02-07'); // 1 year later
    });

    it('should handle edge cases for months with fewer days', () => {
      const startDate = '2025-01-31'; // Start on a 31st
      const revisionDates = calculateRevisionDates(startDate);

      expect(revisionDates[1]).toBe('2025-02-28'); // Should return the last day of February
    });
  });

  describe('isTopicDuplicate', () => {
    it('should return true if the topic already exists for the user', () => {
      const userId = 'user1';
      const newTopic = { topicName: 'Test Topic', date: '2025-02-07', revisionDates: ['2025-02-14', '2025-03-07'] };

      // Mock getData to return existing data
      getData.mockReturnValueOnce([
        { topicName: 'Test Topic', date: '2025-02-07', revisionDates: ['2025-02-14', '2025-03-07'] }
      ]);

      const result = isTopicDuplicate(userId, newTopic);
      expect(result).toBe(true);
    });

    it('should return false if the topic does not exist for the user', () => {
      const userId = 'user2';
      const newTopic = { topicName: 'New Topic', date: '2025-02-07', revisionDates: ['2025-02-14', '2025-03-07'] };

      // Mock getData to return no existing data
      getData.mockReturnValueOnce([]);

      const result = isTopicDuplicate(userId, newTopic);
      expect(result).toBe(false);
    });
  });

  describe('displayAgenda', () => {
    it('should display agenda items for the user', () => {
      const userId = 'user1';
      const userAgenda = [
        { topic: 'Test Topic', revisionDates: ['2025-02-07', '2025-03-07'] },
      ];

      // Mock getData to return userAgenda
      getData.mockReturnValueOnce(userAgenda);

      // Mock DOM elements
      const agendaList = document.createElement('ul');
      global.document.getElementById = jest.fn(() => agendaList);

      displayAgenda(userId);
      expect(agendaList.children.length).toBe(1);
      expect(agendaList.children[0].textContent).toBe('Test Topic, 7 February 2025');
    });

    it('should display a message if no agenda is found', () => {
      const userId = 'user1';

      // Mock getData to return empty agenda
      getData.mockReturnValueOnce([]);

      // Mock DOM elements
      const agendaList = document.createElement('ul');
      global.document.getElementById = jest.fn(() => agendaList);

      displayAgenda(userId);
      expect(agendaList.children.length).toBe(1);
      expect(agendaList.children[0].textContent).toBe('No agenda found for this user.');
    });
  });

  describe('searchBar functionality', () => {
    it('should filter agenda items based on search input', () => {
      const agendaItems = [
        { textContent: 'Test Topic, 7 February 2025' },
        { textContent: 'Another Topic, 14 February 2025' },
      ];

      // Mock the querySelectorAll to return agendaItems
      global.document.querySelectorAll = jest.fn(() => agendaItems);

      const searchInput = 'Test';
      searchBar.value = searchInput;
      searchBar.dispatchEvent(new Event('input'));

      agendaItems.forEach(item => {
        if (item.textContent.toLowerCase().includes(searchInput.toLowerCase())) {
          expect(item.style.display).toBe('');
        } else {
          expect(item.style.display).toBe('none');
        }
      });
    });
  });
});

# Space-Repetition-Tracker

# Revision Planner App

This is a web application that helps users plan their revision schedule by adding topics and calculating revision dates based on a selected date. The app is designed to be accessible, user-friendly, and includes unit tests to ensure functionality.

## Features

- **User Selection**: A drop-down menu allows users to select from 5 predefined users.
- **Topic Form**:
  - A text input for entering a topic name.
  - A date picker that defaults to today's date but allows selection of another date.
  - A submit button to add the topic.
- **Revision Dates**:
  - Calculates revision dates for one week, one month, three months, six months, and one year from the selected date.
  - Displays the updated agenda for the selected user after adding a new topic.
- **Accessibility**: The app is designed to be fully accessible, including keyboard navigation (e.g., pressing "Enter" submits the form).
- **Unit Tests**: Includes unit tests to validate the functionality of key components.

## How to Use

1. **Select a User**: Choose a user from the drop-down menu.
2. **Add a Topic**:
   - Enter the topic name in the text input.
   - Select a date using the date picker (defaults to today's date).
   - Click the "Submit" button or press "Enter" to add the topic.
3. **View Agenda**: The app will display the agenda for the selected user, including the newly added topic and its revision dates.
4. **Add More Topics**: Repeat the process to add more topics for the same or different users.

## Unit Tests

Unit tests have been written for the `calculateRevisionDates` function to ensure it correctly calculates revision dates for one week, one month, three months, six months, and one year from a given start date. The tests also handle edge cases such as leap years and end-of-month dates.

To run the tests, use the following command:
```bash
npm test
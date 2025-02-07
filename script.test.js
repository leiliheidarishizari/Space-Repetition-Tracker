import { calculateRevisionDates } from './storage.js';

describe('calculateRevisionDates', () => {
  it('should return the correct revision dates for a given start date', () => {
    const startDate = '2025-02-07'; // Let's assume this is the start date

    const result = calculateRevisionDates(startDate);

    // Check if we have 5 dates (1 week, 1 month, 3 months, 6 months, 1 year)
    expect(result.length).toBe(5);

    // Check the first revision date (7 days from start date)
    const expectedFirstRevision = '2025-02-14'; // 7 days later
    expect(result[0]).toBe(expectedFirstRevision);

    // Check the second revision date (1 month from start date)
    const expectedSecondRevision = '2025-03-07'; // 1 month later
    expect(result[1]).toBe(expectedSecondRevision);

    // Check the third revision date (3 months from start date)
    const expectedThirdRevision = '2025-05-07'; // 3 months later
    expect(result[2]).toBe(expectedThirdRevision);

    // Check the fourth revision date (6 months from start date)
    const expectedFourthRevision = '2025-08-07'; // 6 months later
    expect(result[3]).toBe(expectedFourthRevision);

    // Check the fifth revision date (1 year from start date)
    const expectedFifthRevision = '2026-02-07'; // 1 year later
    expect(result[4]).toBe(expectedFifthRevision);
  });
});

import { expect, test } from '@playwright/test';
import testData from '../fixtures/testData.json';
import { FormsPage, StudentFormData } from '../pages/forms.page';
import { formatDateForDemoQaModal, joinValues } from '../utils/helpers';

test.describe('Student Registration Form', () => {
  // Suite intent: validate end-to-end form submission using fixture-driven datasets,
  // asserting only against the confirmation modal output.
  // Data-driven: each fixture dataset becomes a separate test case.
  // This keeps coverage high while keeping the test logic identical.
  testData.forms.forEach((dataset, index) => {
    test(`submits dataset ${index + 1} and validates confirmation modal`, async ({ page }) => {
      const formsPage = new FormsPage(page);
      const data = dataset as StudentFormData;

      // Arrange
      await formsPage.navigate('/automation-practice-form');

      // Act
      const confirmationData = await formsPage.submitStudentForm(data);

      // Assert
      expect(confirmationData['Student Name']).toBe(`${data.firstName} ${data.lastName}`);
      expect(confirmationData['Student Email']).toBe(data.email);
      expect(confirmationData['Gender']).toBe(data.gender);
      expect(confirmationData['Mobile']).toBe(data.mobile);
      expect(confirmationData['Date of Birth']).toBe(formatDateForDemoQaModal(data.dateOfBirth));
      expect(confirmationData['Subjects']).toBe(joinValues(data.subjects));
      expect(confirmationData['Hobbies']).toBe(joinValues(data.hobbies));
      expect(confirmationData['Address']).toBe(data.address);
      expect(confirmationData['State and City']).toBe(`${data.state} ${data.city}`);
    });
  });
});

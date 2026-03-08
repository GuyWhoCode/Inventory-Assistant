# Playwright Tests - Inventory Management

This directory contains end-to-end tests for the Inventory Management application using Playwright.

## Test Scenarios

### 1. Happy Path Test
**Test Name:** `Happy Path: Complete inventory workflow from image upload to item editing`

This test simulates a complete workflow where everything works as expected:

1. ✅ Navigate to the Add New Inventory page
2. ✅ Manually add an item (simulating a missing detection from AI)
3. ✅ Edit items in the confirmation table
4. ✅ Process and save the new inventory
5. ✅ Get redirected to the home page (dashboard)
6. ✅ Click on an item to view its details
7. ✅ Edit the item (name, quantity, expiration date)
8. ✅ Log today's usage amount
9. ✅ Verify the average usage rate updates
10. ✅ Save changes and navigate back to home

### 2. Edge Case Test
**Test Name:** `Edge Case: Item with expiration risk (expires before full consumption)`

This test simulates an edge case scenario where an item has limited quantity and may expire before it's fully consumed:

1. ✅ Add a perishable item with low quantity (5 units)
2. ✅ Process the inventory
3. ✅ Navigate to the item details
4. ✅ Set an expiration date (5 days from now)
5. ✅ Log high daily usage (2 units/day) multiple times to establish usage pattern
6. ✅ Verify that the system displays usage rate and days remaining
7. ✅ Check if expiration risk alert appears (when usage_rate × days_remaining > quantity)
8. ✅ Verify edit and save functionality
9. ✅ Navigate back and confirm item is still in the dashboard

## Running the Tests

### Prerequisites
- Node.js installed
- All dependencies installed: `npm install` or `bun install`
- Development server running or auto-start configured

### Commands

#### Run all tests
```bash
npm run test
```

#### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

#### Run tests in debug mode
```bash
npm run test:debug
```

#### Run specific test
```bash
npx playwright test tests/inventory-flow.spec.ts
```

#### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

#### Run tests for specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

The tests are configured in `playwright.config.ts` with the following settings:

- **Base URL:** `http://localhost:3000`
- **Test Directory:** `./tests`
- **Browsers:** Chromium, Firefox, WebKit
- **Reporter:** HTML report (view with `npx playwright show-report`)
- **Auto Web Server:** Development server starts automatically before tests

## Key Test Patterns

### Waiting for Navigation
```typescript
await page.click('button');
await page.waitForURL('/new-page');
```

### Checking Visibility
```typescript
await expect(page.locator('text=Success')).toBeVisible();
```

### Form Input
```typescript
await itemNameInput.fill('Test Item');
await itemQuantityInput.fill('10');
```

### Conditional Actions
```typescript
if (await element.isVisible()) {
  await element.click();
}
```

## Notes

- Tests use flexible selectors to handle different UI variations
- If AI image detection is manually tested, that step can be replaced with direct form submission
- The expiration risk calculation depends on usage rate and projected depletion date
- All tests include proper waiting and visibility checks to prevent flakiness

## Troubleshooting

### Tests timeout
- Ensure the development server is running on `http://localhost:3000`
- Check network connectivity
- Increase timeout in specific steps if needed

### Selectors not found
- Review HTML structure of components
- Use Playwright Inspector: `npx playwright test --debug`
- Update selectors in test as needed

### Database/API issues
- Ensure database is running and connected
- Check that API routes are responding
- Review console logs and network tab in browser

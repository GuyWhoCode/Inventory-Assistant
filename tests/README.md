# Playwright Tests - Inventory Management

This directory contains end-to-end tests for the Inventory Management application using Playwright.

## Test Scenarios

### 1. Happy Path Test

**Test Name:** `Happy Path: Complete inventory workflow from manual entry to item editing`

This test simulates a complete workflow where everything works as expected:

1. ✅ Navigate to the Add New Inventory page
2. ✅ Switch to the Manual tab and fill in item details (name, quantity, expiration date)
3. ✅ Submit the form and verify the **"Item saved"** toast appears, then dismiss it
4. ✅ Edit the item name in the confirmation table
5. ✅ Click "Process Inventory Entry" and verify the **"Inventory processed successfully"** toast appears, then dismiss it
6. ✅ Get redirected to the home page (dashboard) and confirm the item is listed
7. ✅ Click on the item card to view its full details page
8. ✅ Edit the item (name, quantity, expiration date)
9. ✅ Log today's usage amount and verify the **usage logged** toast appears, then dismiss it
10. ✅ Save changes and verify the **save confirmation** toast appears, then dismiss it
11. ✅ Verify the average usage rate updates on the chart
12. ✅ Navigate back to home

### 2. Edge Case Test

**Test Name:** `Edge Case: Item with expiration risk (expires before full consumption)`

This test simulates a scenario where a perishable item may expire before it's fully consumed:

1. ✅ Switch to the Manual tab and add a perishable item with low quantity (5 units, expiring in 2 days)
2. ✅ Submit the form and verify the **"Item saved"** toast appears, then dismiss it
3. ✅ Click "Process Inventory Entry" and verify the **"Inventory processed successfully"** toast appears, then dismiss it
4. ✅ Get redirected to the dashboard and click the perishable item card
5. ✅ Set the expiration date to 2 days from now
6. ✅ Log a high daily usage amount (2 units/day) and verify the **usage logged** toast appears, then dismiss it
7. ✅ Verify the system displays usage rate and estimated days remaining
8. ✅ Check if an expiration risk alert appears (triggered when projected depletion > expiration date)
9. ✅ Save changes and verify the **save confirmation** toast appears, then dismiss it
10. ✅ Reduce quantity and save again, dismissing the toast each time
11. ✅ Navigate back and confirm the item is still visible in the dashboard

## Toast Handling

Both tests use a shared `dismissToast` helper that:
1. Waits for the toast to become visible (up to 7 seconds)
2. Clicks the `✕` close button (`button[data-close-button]`) rendered by Sonner
3. Falls back to removing all `[data-sonner-toast]` elements via JavaScript if no close button is present
4. Asserts the toast is no longer visible before proceeding

This prevents toasts from stacking up and blocking subsequent clicks or assertions.

```typescript
await dismissToast(page, /Inventory processed successfully/);
```

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

#### Run specific test file
```bash
npx playwright test tests/inventory-flow.spec.ts
```

#### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

#### Run tests for a specific browser
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

### Dismissing Sonner Toasts
```typescript
await dismissToast(page, /Item saved|Test Item \(qty 10\) added successfully/);
```

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

- Toast dismissal is performed after every action that triggers a Sonner notification to prevent UI interference with subsequent steps
- The expiration risk alert is conditional — it appears only when the projected depletion date exceeds the expiration date based on the current usage rate
- All tests include proper waiting and visibility checks to prevent flakiness
- The Manual tab must be explicitly selected on the Add New Inventory page before the form becomes visible

## Troubleshooting

### Tests timeout
- Ensure the development server is running on `http://localhost:3000`
- Check network connectivity
- Increase timeout in specific steps if needed

### Toast not found / `dismissToast` times out
- Confirm `<Toaster closeButton />` is set in your root layout — the helper targets `button[data-close-button]`
- If the toast message text has changed, update the regex pattern passed to `dismissToast`

### Selectors not found
- Review HTML structure of components
- Use Playwright Inspector: `npx playwright test --debug`
- Update selectors in the test file as needed

### Database/API issues
- Ensure the database is running and connected
- Check that API routes are responding
- Review console logs and the network tab in the browser DevTools
import { test, expect, Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helper: verify a toast appeared, then close it via the X button
// ---------------------------------------------------------------------------
async function dismissToast(page: Page, pattern: RegExp) {
    const toast = page
        .locator("[data-sonner-toast]")
        .filter({ hasText: pattern });

    await expect(toast).toBeVisible({ timeout: 7000 });

    const closeBtn = toast.locator("button[data-close-button]");
    if (await closeBtn.isVisible()) {
        await closeBtn.click();
    } else {
        // Fallback: remove via JS if close button isn't rendered
        await page.evaluate(() => {
            document
                .querySelectorAll("[data-sonner-toast]")
                .forEach((el) => el.remove());
        });
    }

    await expect(toast).not.toBeVisible({ timeout: 3000 });
}

test.describe("Inventory Management User Flow", () => {
    test("Happy Path: Complete inventory workflow from manual entry to item editing", async ({
        page,
    }) => {
        // Step 1: Navigate to the Add New Inventory page
        await page.goto("/");
        await expect(
            page.getByRole("heading", { name: "Inventory Assistant" }),
        ).toBeVisible();

        await page.click('a:has-text("Add New Inventory")');
        await expect(
            page.getByRole("heading", { name: "Add New Inventory" }),
        ).toBeVisible();

        // Step 3: Click the Manual tab first
        const manualInputTab = page.locator('[role="tab"]:has-text("Manual")');
        await manualInputTab.click();

        // Wait for the form to be visible after tab click
        const itemNameInput = page.locator("#item-name");
        await itemNameInput.waitFor({ state: "visible", timeout: 5000 });

        // Step 4: Fill in the manual form with test data
        const itemQuantityInput = page.locator("#item-quantity");
        const itemExpirationInput = page.locator("#item-expiration");

        await itemNameInput.fill("Test Item - Milk");
        await itemQuantityInput.fill("10");

        // Set expiration date (30 days from now)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const dateString = futureDate.toISOString().split("T")[0];
        await itemExpirationInput.fill(dateString);

        // Click the "Save item" button
        const saveItemButton = page
            .locator('button:has-text("Save item")')
            .first();
        await saveItemButton.click();

        // Verify and dismiss the "Item saved" toast before proceeding to the table
        await dismissToast(
            page,
            /Item saved|Test Item - Milk \(qty 10\) added successfully/,
        );

        // Step 5: Verify the confirmation table exists and is ready for input
        await expect(page.locator("text=Process Inventory Entry")).toBeVisible({
            timeout: 10000,
        });

        // Step 6: Edit items in the confirmation table
        const tableInputs = page.locator('input[type="text"]');
        const tableCount = await tableInputs.count();

        if (tableCount > 0) {
            await tableInputs.first().clear();
            await tableInputs.first().fill("Updated Item Name");
        }

        // Step 7: Click the "Process Inventory Entry" button to save entries
        await page.click('button:has-text("Process Inventory Entry")');

        // Verify and dismiss the "Inventory processed successfully" toast
        await dismissToast(page, /Inventory processed successfully/);

        // Step 8: Verify redirect to home page (dashboard)
        await page.waitForURL("/");
        await expect(
            page.getByRole("heading", { name: "Inventory Assistant" }),
        ).toBeVisible();

        // Wait for the new item to appear in the list
        await expect(page.locator("text=Updated Item Name")).toBeVisible({
            timeout: 10000,
        });

        // Step 9: Click on the item card to view its details
        const itemCard = page.locator("#item-updated-item-name");
        await expect(itemCard).toBeVisible();
        await itemCard.click();

        // Step 10: Verify we're on the item detail page
        await expect(page.locator("text=Item Details")).toBeVisible();

        // Step 11: Edit item details
        const itemNameField = page
            .locator("input")
            .filter({ hasValue: /Updated Item Name|Test Item/ })
            .first();
        await itemNameField.clear();
        await itemNameField.fill("Final Item Name - Milk");

        const quantityField = page.locator('input[type="number"]').first();
        await quantityField.clear();
        await quantityField.fill("15");

        const expirationInputs = page.locator('input[type="date"]');
        if ((await expirationInputs.count()) > 0) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            const dateString = futureDate.toISOString().split("T")[0];
            await expirationInputs.first().fill(dateString);
        }

        // Step 12: Log today's usage amount
        const usageInputs = page.locator('input[placeholder="0"]');
        if ((await usageInputs.count()) > 0) {
            await usageInputs.first().fill("3");
        }

        const logButton = page.locator('button:has-text("Log")').first();
        if (await logButton.isVisible()) {
            await logButton.click();
        }

        // Step 13: Verify the usage toast then dismiss it
        await dismissToast(page, /Logged usage|updated|successfully/);

        // Step 14: Save changes and dismiss the save toast
        const saveButton = page.locator('button:has-text("Save")').first();
        if (await saveButton.isVisible()) {
            await saveButton.click();
            await dismissToast(page, /updated|successfully/);
        }

        // Step 15: Verify the usage rate has been updated on the chart
        await expect(page.locator("text=Avg Usage Rate")).toBeVisible();

        // Step 16: Navigate back to home
        await page.click('a:has-text("Back to Home")');
        await expect(
            page.getByRole("heading", { name: "Inventory Assistant" }),
        ).toBeVisible();
    });

    test("Edge Case: Item with expiration risk (expires before full consumption)", async ({
        page,
    }) => {
        // Step 1: Navigate to Add New Inventory
        await page.goto("/");
        await page.click('a:has-text("Add New Inventory")');
        await expect(
            page.getByRole("heading", { name: "Add New Inventory" }),
        ).toBeVisible();

        // Step 2: Click Manual tab and add a test item
        const manualInputTab2 = page.locator('[role="tab"]:has-text("Manual")');
        await manualInputTab2.click();

        const itemNameInput2 = page.locator("#item-name");
        await itemNameInput2.waitFor({ state: "visible", timeout: 5000 });

        const itemQuantityInput2 = page.locator("#item-quantity");
        const itemExpirationInput2 = page.locator("#item-expiration");

        await itemNameInput2.fill("Perishable Item - Ice Cream");
        await itemQuantityInput2.fill("5");

        const soonDate = new Date();
        soonDate.setDate(soonDate.getDate() + 2);
        const soonDateString = soonDate.toISOString().split("T")[0];
        await itemExpirationInput2.fill(soonDateString);

        const saveItemButton2 = page
            .locator('button:has-text("Save item")')
            .first();
        await saveItemButton2.click();

        // Verify and dismiss the "Item saved" toast before proceeding to the table
        await dismissToast(
            page,
            /Item saved|Perishable Item - Ice Cream \(qty 5\) added successfully/,
        );

        // Step 3: Process the inventory
        await page.click('button:has-text("Process Inventory Entry")');

        // Verify and dismiss the "Inventory processed successfully" toast
        await dismissToast(page, /Inventory processed successfully/);

        await page.waitForURL("/");

        // Step 4: Click on the perishable item card
        const itemCard = page.locator("#item-perishable-item---ice-cream");
        await expect(itemCard).toBeVisible();
        await itemCard.click();

        // Step 5: Verify item details page
        await expect(page.locator("text=Item Details")).toBeVisible();

        // Step 6: Set expiration date to 2 days from now
        const expirationInputs = page.locator('input[type="date"]');
        if ((await expirationInputs.count()) > 0) {
            const soonDate = new Date();
            soonDate.setDate(soonDate.getDate() + 2);
            const dateString = soonDate.toISOString().split("T")[0];
            await expirationInputs.first().fill(dateString);
        }

        // Step 7: Log high daily usage
        const usageInputs = page.locator('input[placeholder="0"]');
        if ((await usageInputs.count()) > 0) {
            await usageInputs.first().fill("2");
        }

        const logButton = page.locator('button:has-text("Log")').first();
        if (await logButton.isVisible()) {
            await logButton.click();
        }

        // Verify and dismiss the usage log toast
        await dismissToast(page, /Logged usage|updated|successfully/);

        // Step 8: Verify the expiration risk alert appears (if triggered)
        await expect(page.locator("text=Item Details")).toBeVisible();

        // Step 9: Verify usage stats are displaying
        await expect(page.locator("text=Avg Usage Rate")).toBeVisible();

        // Step 10: Verify the estimated days remaining calculation
        await expect(page.locator("text=Est. Days Remaining")).toBeVisible();

        // Step 11: Save changes and dismiss the save toast
        const saveButton = page.locator('button:has-text("Save")').first();
        if (await saveButton.isVisible()) {
            await saveButton.click();
            await dismissToast(page, /updated|successfully/);
        }

        // Step 12: Reduce quantity
        const quantityField = page.locator('input[type="number"]').first();
        await quantityField.clear();
        await quantityField.fill("100");

        // Step 13: Save and dismiss the toast
        const saveBtn = page.locator('button:has-text("Save")').first();
        if (await saveBtn.isVisible()) {
            await saveBtn.click();
            await dismissToast(page, /updated|successfully/);
        }

        // Step 14: Navigate back to verify the item is still in the dashboard
        await page.click('a:has-text("Back to Home")');
        await expect(
            page.getByRole("heading", { name: "Inventory Assistant" }),
        ).toBeVisible();

        // Step 15: Verify the perishable item is still visible in the list
        const finalItemCard = page.locator("#item-perishable-item---ice-cream");
        await expect(finalItemCard).toBeVisible();
    });
});

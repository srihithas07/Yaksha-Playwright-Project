import { Page, Locator } from "@playwright/test";

export default class LeavePage {
  readonly page: Page;
  private leave: Locator;
  private leaveDropdown: Locator;
  private holiday: Locator;
  private configure: Locator;
  private button: Locator;
  private holidayName: Locator;
  private holidayDateDDMMYYYY: Locator;
  private holidayDateYYYYMMDD: Locator;
  private holidayDateYYYYDDMM: Locator;
  private saveButton: Locator;
  private holidayList: Locator;

  public static readonly HolidayName = "National Holiday123";
  private static readonly startDate = new Date("2025-01-01");
  private static readonly endDate = new Date("2025-12-31");
  public static randomDate: any;

  constructor(page: Page) {
    this.page = page;

    this.leave = page.locator("//ul[@class='oxd-main-menu']/li[3]");

    this.leaveDropdown = page.locator(
      "(//span[normalize-space()='Configure'])[1]"
    );

    this.configure = page.locator("li.--visited");

    this.holiday = page.locator(
      "(//ul[@class='oxd-dropdown-menu']/li[4])"
    );

    this.button = page.locator(
      "//div[@class='orangehrm-header-container']/button"
    );

    this.holidayName = page.locator(
      "(//input[@class='oxd-input oxd-input--active'])[2]"
    );

    this.holidayDateDDMMYYYY = page.locator(
      "//input[@placeholder='dd-mm-yyyy']"
    );

    this.holidayDateYYYYMMDD = page
      .locator("//input[@placeholder='yyyy-mm-dd']")
      .first();

    this.holidayDateYYYYDDMM = page.locator(
      "//input[@placeholder='yyyy-dd-mm']"
    );

    this.saveButton = page.locator(
      "//div[@class='oxd-form-actions']/button[2]"
    );

    this.holidayList = page.locator(
      `//div[contains(text(),"${LeavePage.HolidayName}")]`
    );
  }

  async createNewLeaveRequest() {
    await this.leave.click();

    await this.configure.click();

    await this.leaveDropdown.click();

    await this.holiday.click();

    await this.button.click();

    await this.holidayName.fill(LeavePage.HolidayName);

    let dateField: Locator;
    let format: "dd-mm-yyyy" | "yyyy-mm-dd" | "yyyy-dd-mm";

    if (await this.holidayDateDDMMYYYY.isVisible()) {
      dateField = this.holidayDateDDMMYYYY;
      format = "dd-mm-yyyy";
    } else if (await this.holidayDateYYYYMMDD.isVisible()) {
      dateField = this.holidayDateYYYYMMDD;
      format = "yyyy-mm-dd";
    } else if (await this.holidayDateYYYYDDMM.isVisible()) {
      dateField = this.holidayDateYYYYDDMM;
      format = "yyyy-dd-mm";
    } else {
      throw new Error("No supported date input field found.");
    }

    LeavePage.randomDate = this.getRandomDate(
      LeavePage.startDate,
      LeavePage.endDate,
      format
    );

    await dateField.fill(LeavePage.randomDate);

    await this.page.locator(".oxd-form-loader").waitFor({
      state: "hidden",
    });

    await this.saveButton.click();

    // Give the save operation time to complete.
    // We do not wait indefinitely for the loader to disappear,
    // because it can remain visible during the full test suite.
    await this.page.waitForTimeout(1000);

    let validationCount = await this.page
      .locator("//span[text()='Already exists']")
      .count();

    while (validationCount > 0) {
      LeavePage.randomDate = this.getRandomDate(
        LeavePage.startDate,
        LeavePage.endDate,
        format
      );

      await dateField.fill(LeavePage.randomDate);

      await this.saveButton.click();

      await this.page.waitForTimeout(1000);

      validationCount = await this.page
        .locator("//span[text()='Already exists']")
        .count();
    }
  }

  getRandomDate(
    startDate: Date,
    endDate: Date,
    format: "dd-mm-yyyy" | "yyyy-mm-dd" | "yyyy-dd-mm"
  ): string {
    const start = startDate.getTime();
    const end = endDate.getTime();

    const randomTime = start + Math.random() * (end - start);
    const date = new Date(randomTime);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    switch (format) {
      case "dd-mm-yyyy":
        return `${day}-${month}-${year}`;

      case "yyyy-mm-dd":
        return `${year}-${month}-${day}`;

      case "yyyy-dd-mm":
        return `${year}-${day}-${month}`;

      default:
        throw new Error(`Unsupported date format: ${format}`);
    }
  }
}
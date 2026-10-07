import { Locator, Page } from "@playwright/test";

export class MyInfoPage {
  readonly page: Page;
  private Myinfo: Locator;
  private clickImage: Locator;
  private uploadButton: Locator;
  private fileInput: Locator;
  private ImageSave: Locator;
  private updateMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Myinfo = page.locator("text=My Info");
    this.clickImage = page.locator(".employee-image");
    this.uploadButton = page.locator(".employee-image-action");
    this.fileInput = page.locator('input[type="file"].oxd-file-input');
    this.ImageSave = page.locator("button[type='submit']");

    this.updateMessage = page.locator(
      ".oxd-text.oxd-text--p.oxd-text--toast-message.oxd-toast-content-text"
    );
  }

  async uploadProfilePicture() {
    await this.Myinfo.click();
    await this.clickImage.click();
    await this.fileInput.setInputFiles("TestImage.jpg");
    await this.ImageSave.click();
  }
}
import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import puppeteer from "puppeteer";

import { S3Service } from "@gemunion/nest-js-module-s3";

@Injectable()
export class PuppeteerService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly s3Service: S3Service,
  ) {}

  public async print(payload: string): Promise<string> {
    // eslint-disable-next-line import/no-named-as-default-member
    const browser = await puppeteer.launch({
      args: ["--headless", "--disable-gpu", "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setContent(payload);

    const pdf = await page.pdf({
      printBackground: true,
      format: "a4",
    });

    await browser.close();

    return this.s3Service.putObject({
      contentType: "application/pdf",
      content: pdf,
    });
  }
}

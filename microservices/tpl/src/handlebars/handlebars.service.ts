import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

import { PdfType, RmqProviderType, TemplateType } from "@gemunion/framework-types";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HandlebarsService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.PDF_SERVICE)
    private readonly pdfClientProxy: ClientProxy,
  ) {}

  public async tpl(name: TemplateType, payload: any): Promise<string> {
    this.loggerService.log(`Template: ${name}; data: ${JSON.stringify(payload)}`);

    const pathToFile = path.join(__dirname, "../../static", `${name}.html`);

    const source = await fs.promises.readFile(pathToFile);

    const template = handlebars.compile(source.toString("utf8"));

    return this.print(template(payload));
  }

  private print(html: string): Promise<string> {
    const tpl = this.pdfClientProxy.send<string, string>(PdfType.PRINT, html);
    return firstValueFrom(tpl);
  }
}

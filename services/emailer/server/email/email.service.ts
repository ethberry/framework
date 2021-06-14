import {Injectable} from "@nestjs/common";

import {SesService, ISesSendFields} from "@trejgun/nest-js-module-ses";

@Injectable()
export class EmailService {
  constructor(private readonly sesService: SesService) {}

  public sendEmail(fields: ISesSendFields): Promise<{status: boolean}> {
    return this.sesService.sendEmail(fields);
  }
}

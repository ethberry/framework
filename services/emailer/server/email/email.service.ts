import {Injectable} from "@nestjs/common";

import {SesService, ISesSendDto} from "@gemunionstudio/nest-js-module-ses";

@Injectable()
export class EmailService {
  constructor(private readonly sesService: SesService) {}

  public sendEmail(dto: ISesSendDto): Promise<{status: boolean}> {
    return this.sesService.sendEmail(dto);
  }
}

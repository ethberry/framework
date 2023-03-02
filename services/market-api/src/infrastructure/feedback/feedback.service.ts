import { Injectable } from "@nestjs/common";

import { UserEntity } from "../user/user.entity";
import { IFeedbackCreateDto } from "./interfaces";
import { EmailService } from "../email/email.service";

@Injectable()
export class FeedbackService {
  constructor(private readonly emailService: EmailService) {}

  public async createFeedback(dto: IFeedbackCreateDto, userEntity: UserEntity): Promise<void> {
    await this.emailService.feedback(dto, userEntity);
  }
}

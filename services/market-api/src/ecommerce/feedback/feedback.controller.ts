import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../user/user.entity";
import { FeedbackService } from "./feedback.service";
import { FeedbackCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post("/")
  @HttpCode(HttpStatus.NO_CONTENT)
  public createFeedback(@Body() body: FeedbackCreateDto, @User() userEntity: UserEntity): Promise<void> {
    return this.feedbackService.createFeedback(body, userEntity);
  }
}

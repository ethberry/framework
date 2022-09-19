import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { WaitlistService } from "./waitlist.service";
import { WaitlistEntity } from "./waitlist.entity";
import { WaitlistItemCreateDto } from "./dto";
import { UserEntity } from "../../../user/user.entity";

@ApiBearerAuth()
@Controller("/waitlist")
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post("/")
  public create(@Body() dto: WaitlistItemCreateDto): Promise<WaitlistEntity> {
    return this.waitlistService.create(dto);
  }

  @Get("/proof")
  public proof(@User() userEntity: UserEntity): Promise<{ proof: Array<string> }> {
    return this.waitlistService.proof(userEntity);
  }
}

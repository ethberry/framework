import { Body, Controller, Get, Post, Put, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { ReferralProgramService } from "./referral.program.service";
import { ReferralProgramCreateDto, ReferralProgramUpdateDto } from "./dto";
import { ReferralProgramEntity } from "./referral.program.entity";

@ApiBearerAuth()
@Controller("/referral/program")
export class ReferralProgramController {
  constructor(private readonly referralProgramService: ReferralProgramService) {}

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@User() userEntity: UserEntity): Promise<Array<ReferralProgramEntity>> {
    return this.referralProgramService.findAllWithRelations(userEntity);
  }

  @Post("/")
  public create(
    @Body() dto: ReferralProgramCreateDto,
    @User() userEntity: UserEntity,
  ): Promise<ReferralProgramEntity[]> {
    return this.referralProgramService.createRefProgram(dto, userEntity);
  }

  @Put("/")
  public update(
    @Body() dto: ReferralProgramUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ReferralProgramEntity[]> {
    return this.referralProgramService.update(dto, userEntity);
  }
}

import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ReferralProgramService } from "./referral.program.service";
import { ReferralProgramCreateDto, ReferralProgramSearchDto, ReferralProgramUpdateDto } from "./dto";
import { ReferralProgramEntity } from "./referral.program.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/referral/program")
export class ReferralProgramController {
  constructor(private readonly referralProgramService: ReferralProgramService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ReferralProgramSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ReferralProgramEntity>, number]> {
    return this.referralProgramService.findRefProgram(dto, userEntity);
  }

  @Post("/")
  public create(
    @Body() dto: ReferralProgramCreateDto,
    @User() userEntity: UserEntity,
  ): Promise<ReferralProgramEntity[]> {
    return this.referralProgramService.createRefProgram(dto, userEntity);
  }

  // TODO TEST ALL
  @Put("/:merchantId")
  public update(
    @Param("merchantId", ParseIntPipe) merchantId: number,
    @Body() dto: ReferralProgramUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ReferralProgramEntity[]> {
    return this.referralProgramService.updateRefProgram(merchantId, dto, userEntity);
  }

  @Get("/:merchantId")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("merchantId", ParseIntPipe) merchantId: number,
    @User() userEntity: UserEntity,
  ): Promise<Array<ReferralProgramEntity>> {
    return this.referralProgramService.findAllWithRelations(merchantId, userEntity);
  }
}

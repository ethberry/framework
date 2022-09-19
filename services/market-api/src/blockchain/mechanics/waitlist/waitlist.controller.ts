import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { WaitlistService } from "./waitlist.service";
import { WaitlistEntity } from "./waitlist.entity";
import { WaitlistClaimDto, WaitlistItemCreateDto } from "./dto";
import { UserEntity } from "../../../user/user.entity";

@ApiBearerAuth()
@Controller("/waitlist")
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@User() userEntity: UserEntity): Promise<[Array<WaitlistEntity>, number]> {
    return this.waitlistService.search(userEntity);
  }

  @Post("/")
  public create(@Body() dto: WaitlistItemCreateDto): Promise<WaitlistEntity> {
    return this.waitlistService.create(dto);
  }

  @Post("/proof")
  public proof(@Body() dto: WaitlistClaimDto, @User() userEntity: UserEntity): Promise<{ proof: Array<string> }> {
    return this.waitlistService.proof(dto, userEntity);
  }
}

import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { WaitlistItemService } from "./item.service";
import { WaitlistItemEntity } from "./item.entity";
import { WaitlistItemCreateDto, WaitlistProofDto } from "./dto";
import { UserEntity } from "../../../../ecommerce/user/user.entity";

@ApiBearerAuth()
@Controller("/waitlist/item")
export class WaitlistItemController {
  constructor(private readonly waitlistItemService: WaitlistItemService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@User() userEntity: UserEntity): Promise<[Array<WaitlistItemEntity>, number]> {
    return this.waitlistItemService.search(userEntity);
  }

  @Post("/")
  public create(@Body() dto: WaitlistItemCreateDto): Promise<WaitlistItemEntity> {
    return this.waitlistItemService.create(dto);
  }

  @Post("/proof")
  public proof(@Body() dto: WaitlistProofDto, @User() userEntity: UserEntity): Promise<{ proof: Array<string> }> {
    return this.waitlistItemService.proof(dto, userEntity);
  }
}

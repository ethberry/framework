import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { DiscreteService } from "./discrete.service";
import { DiscreteEntity } from "./discrete.entity";
import { DiscreteAutocompleteDto, DiscreteSignDto, DiscreteSearchDto } from "./dto";

@Public()
@Controller("/grade")
export class DiscreteController {
  constructor(private readonly gradeService: DiscreteService) {}

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Query() dto: DiscreteSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<DiscreteEntity | null> {
    return this.gradeService.findOneByToken(dto, merchantEntity);
  }

  @Post("/sign")
  public sign(@Body() dto: DiscreteSignDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.gradeService.sign(dto, merchantEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: DiscreteAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<DiscreteEntity>> {
    return this.gradeService.autocomplete(dto, merchantEntity);
  }
}

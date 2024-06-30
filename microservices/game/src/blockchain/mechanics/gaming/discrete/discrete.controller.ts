import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { DiscreteAutocompleteDto, DiscreteSignDto, DiscreteFindOneDto } from "./dto";
import { DiscreteService } from "./discrete.service";
import { DiscreteEntity } from "./discrete.entity";

@Public()
@Controller("/discrete")
export class DiscreteController {
  constructor(private readonly discreteService: DiscreteService) {}

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Query() dto: DiscreteFindOneDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<DiscreteEntity | null> {
    return this.discreteService.findOneByToken(dto, merchantEntity);
  }

  @Post("/sign")
  public sign(@Body() dto: DiscreteSignDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.discreteService.sign(dto, merchantEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: DiscreteAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<DiscreteEntity>> {
    return this.discreteService.autocomplete(dto, merchantEntity);
  }
}

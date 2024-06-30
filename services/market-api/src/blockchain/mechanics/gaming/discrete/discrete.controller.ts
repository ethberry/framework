import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { DiscreteAutocompleteDto, DiscreteFindOneDto, DiscreteSignDto } from "./dto";
import { DiscreteService } from "./discrete.service";
import { DiscreteEntity } from "./discrete.entity";

@Public()
@Controller("/discrete")
export class DiscreteController {
  constructor(private readonly discreteService: DiscreteService) {}

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Query() dto: DiscreteFindOneDto): Promise<DiscreteEntity | null> {
    return this.discreteService.findOneByToken(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: DiscreteSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.discreteService.sign(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: DiscreteAutocompleteDto): Promise<Array<DiscreteEntity>> {
    return this.discreteService.autocomplete(dto);
  }
}

import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, Public } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { DiscreteService } from "./discrete.service";
import { DiscreteEntity } from "./discrete.entity";
import { DiscreteAutocompleteDto, DiscreteSearchDto, DiscreteSignDto } from "./dto";

@Public()
@Controller("/grade")
export class DiscreteController {
  constructor(private readonly gradeService: DiscreteService) {}

  @Get("/")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Query() dto: DiscreteSearchDto): Promise<DiscreteEntity | null> {
    return this.gradeService.findOneByToken(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: DiscreteSignDto): Promise<IServerSignature> {
    return this.gradeService.sign(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: DiscreteAutocompleteDto): Promise<Array<DiscreteEntity>> {
    return this.gradeService.autocomplete(dto);
  }
}
import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { PaginationInterceptor } from "@ethberry/nest-js-utils";

import { PaginationDto } from "@ethberry/collection";
import { PayeesService } from "./payees.service";
import { PayeesEntity } from "./payees.entity";

@ApiBearerAuth()
@Controller("/wallet")
export class PayeesController {
  constructor(private readonly payeesService: PayeesService) {}

  @Get("/payees")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<PayeesEntity>, number]> {
    return this.payeesService.search(dto);
  }
}

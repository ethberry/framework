import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { UniContractAutocompleteDto } from "./dto/autocomplete";
import { UniContractService } from "./uni-contract.service";
import { UniContractEntity } from "./uni-contract.entity";

@ApiBearerAuth()
@Controller("/uni-contracts")
export class UniContractController {
  constructor(private readonly uniContractService: UniContractService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: UniContractAutocompleteDto): Promise<Array<UniContractEntity>> {
    return this.uniContractService.autocomplete(dto);
  }
}

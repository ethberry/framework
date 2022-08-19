import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { ChainLinkService } from "./chain-link.service";
import { ContractAutocompleteDto } from "../../hierarchy/contract/dto";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@ApiBearerAuth()
@Controller("/chain-link")
export class ChainLinkController {
  constructor(private readonly chainLinkService: ChainLinkService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: ContractAutocompleteDto): Promise<Array<ContractEntity>> {
    return this.chainLinkService.autocomplete(dto);
  }
}

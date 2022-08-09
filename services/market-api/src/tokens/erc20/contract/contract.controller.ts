import { Controller, Get, Query } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { Erc20ContractService } from "./contract.service";
import { ContractEntity } from "../../../blockchain/hierarchy/contract/contract.entity";
import { ContractAutocompleteDto } from "../../../blockchain/hierarchy/contract/dto/autocomplete";

@Public()
@Controller("/erc20-tokens")
export class Erc20ContractController {
  constructor(private readonly erc20TokenService: Erc20ContractService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: ContractAutocompleteDto): Promise<Array<ContractEntity>> {
    return this.erc20TokenService.autocomplete(dto);
  }
}

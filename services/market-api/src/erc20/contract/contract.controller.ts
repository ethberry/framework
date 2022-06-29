import { Controller, Get, Query } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { Erc20ContractService } from "./contract.service";
import { Erc20ContractAutocompleteDto } from "./dto/autocomplete";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Public()
@Controller("/erc20-tokens")
export class Erc20ContractController {
  constructor(private readonly erc20TokenService: Erc20ContractService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc20ContractAutocompleteDto): Promise<Array<UniContractEntity>> {
    return this.erc20TokenService.autocomplete(dto);
  }
}

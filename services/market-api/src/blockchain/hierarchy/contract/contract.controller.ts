import { Controller, Get, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Public, User } from "@gemunion/nest-js-utils";
import { testChainId } from "@framework/constants";

import { ContractAutocompleteDto } from "./dto";
import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@Public()
@Controller("/contracts")
export class ContractController {
  constructor(private readonly contractService: ContractService, private readonly configService: ConfigService) {}

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);
    return this.contractService.autocomplete(dto, userEntity?.chainId || chainId);
  }
}

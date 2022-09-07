import { Controller, Get, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Public, User } from "@gemunion/nest-js-utils";

import { ContractAutocompleteDto } from "./dto";
import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";
import { UserEntity } from "../../../user/user.entity";

@Public()
@Controller("/contracts")
export class ContractController {
  constructor(private readonly contractService: ContractService, private readonly configService: ConfigService) {}

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");
    return this.contractService.autocomplete(dto, userEntity?.chainId || chainId);
  }
}

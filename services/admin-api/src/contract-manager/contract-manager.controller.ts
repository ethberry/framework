import { Controller, Post, Body } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { IServerSignature } from "@framework/types";

import { ContractManagerService } from "./contract-manager.service";
import { Erc1155TokenDeployDto, Erc20TokenDeployDto, Erc20VestingDeployDto, Erc721TokenDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerController {
  constructor(private readonly contractManagerService: ContractManagerService) {}

  @Post("/erc20-token")
  public erc20Token(@Body() dto: Erc20TokenDeployDto): Promise<IServerSignature> {
    return this.contractManagerService.erc20Token(dto);
  }

  @Post("/erc20-vesting")
  public erc20Vesting(@Body() dto: Erc20VestingDeployDto): Promise<IServerSignature> {
    return this.contractManagerService.erc20Vesting(dto);
  }

  @Post("/erc721-token")
  public erc721Token(@Body() dto: Erc721TokenDeployDto): Promise<IServerSignature> {
    return this.contractManagerService.erc721Token(dto);
  }

  @Post("/erc1155-token")
  public erc1155Token(@Body() dto: Erc1155TokenDeployDto): Promise<IServerSignature> {
    return this.contractManagerService.erc1155Token(dto);
  }
}

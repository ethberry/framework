import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IContractAutocompleteDto } from "@framework/types";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Injectable()
export class ChainLinkService {
  constructor(private readonly contractService: ContractService, private readonly configService: ConfigService) {}

  public async autocomplete(dto: IContractAutocompleteDto): Promise<Array<ContractEntity>> {
    const contractEntities = await this.contractService.autocomplete(dto);

    // MODULE:LOTTERY
    const lottery = new ContractEntity();
    lottery.id = 12345;
    lottery.title = "Lottery";
    lottery.address = this.configService.get<string>("LOTTERY_ADDR", "0x");
    contractEntities.push(lottery);

    return contractEntities;
  }
}

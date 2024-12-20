import { Injectable } from "@nestjs/common";

import type { IContractAutocompleteDto } from "@framework/types";
import { ContractFeatures, ModuleType, TokenType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class ChainLinkContractService {
  constructor(private readonly contractService: ContractService) {}

  public async autocomplete(dto: IContractAutocompleteDto, userEntity: UserEntity): Promise<Array<ContractEntity>> {
    return this.contractService.autocomplete(
      {
        contractType: [TokenType.NATIVE, TokenType.ERC721, TokenType.ERC998],
        contractFeatures: [ContractFeatures.RANDOM],
        contractModule: [ModuleType.HIERARCHY, ModuleType.LOTTERY],
      },
      userEntity,
    );
  }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In, ArrayContains } from "typeorm";
import { Interface } from "ethers";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ContractFeatures, DiscreteEventSignature, ModuleType, TokenType } from "@framework/types";
import ERC721DiscreteSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Discrete/ERC721Discrete.sol/ERC721Discrete.json";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class DiscreteServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.HIERARCHY,
      contractType: In([TokenType.ERC721, TokenType.ERC998]),
      contractFeatures: ArrayContains([ContractFeatures.DISCRETE]),
      chainId,
    });

    this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.DESCRETE,
      contractAddress: address,
      contractInterface: new Interface(ERC721DiscreteSol.abi),
      eventSignatures: [DiscreteEventSignature.LevelUp],
    });
  }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Interface } from "ethers";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ContractManagerEventSignature, ModuleType } from "@framework/types";
import ERC998FactoryFacetSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManagerFacets/ERC998FactoryFacet.sol/ERC998FactoryFacet.json";

import { ContractType } from "../../../utils/contract-type";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class ContractManagerErc998ServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.CONTRACT_MANAGER,
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.CONTRACT_MANAGER,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: new Interface(ERC998FactoryFacetSol.abi),
      eventSignatures: [ContractManagerEventSignature.ERC998TokenDeployed],
    });
  }
}

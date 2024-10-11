import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ContractFeatures, RentableEventSignature, ModuleType, TokenType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ERC721RentableABI } from "./interfaces";
import { ContractType } from "../../../../utils/contract-type";

@Injectable()
export class RentableServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistrySimple(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.HIERARCHY,
      contractType: TokenType.ERC721,
      contractFeatures: In([[ContractFeatures.RENTABLE]]),
      chainId,
    });

    this.ethersService.updateRegistry({
      contractType: ContractType.RENTABLE,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: ERC721RentableABI,
      eventSignatures: [RentableEventSignature.UpdateUser],
    });
  }

  public updateRegistryAndReadBlockSimple(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.RENTABLE,
        contractAddress: address,
        contractInterface: ERC721RentableABI,
        eventSignatures: [RentableEventSignature.UpdateUser],
      },
      blockNumber,
    );
  }
}

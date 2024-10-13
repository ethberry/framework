import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In, Not } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { ContractFeatures, Erc1155EventSignature, ModuleType, TokenType } from "@framework/types";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { Erc1155ABI } from "./interfaces";

@Injectable()
export class Erc1155TokenServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.HIERARCHY,
      contractType: TokenType.ERC1155,
      contractFeatures: Not(In([[ContractFeatures.EXTERNAL]])),
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.ERC1155_TOKEN,
      contractAddress: address,
      contractInterface: Erc1155ABI,
      eventSignatures: [
        Erc1155EventSignature.ApprovalForAll,
        Erc1155EventSignature.TransferSingle,
        Erc1155EventSignature.TransferBatch,
        Erc1155EventSignature.URI,
      ],
    });
  }
}

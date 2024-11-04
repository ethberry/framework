import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { In, Not } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { ContractFeatures, Erc721EventSignature, Erc998EventSignature, ModuleType, TokenType } from "@framework/types";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ERC998SimpleABI } from "./interfaces";

@Injectable()
export class Erc998TokenServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.HIERARCHY,
      contractType: TokenType.ERC998,
      contractFeatures: Not(In([[ContractFeatures.EXTERNAL]])),
      chainId,
    });

    this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.ERC998_TOKEN,
      contractAddress: address,
      contractInterface: ERC998SimpleABI,
      eventSignatures: [
        Erc721EventSignature.Approval,
        Erc721EventSignature.ApprovalForAll,
        Erc721EventSignature.Transfer,
        Erc998EventSignature.BatchReceivedChild,
        Erc998EventSignature.BatchTransferChild,
        Erc998EventSignature.ReceivedChild,
        Erc998EventSignature.SetMaxChild,
        Erc998EventSignature.TransferChild,
        Erc998EventSignature.UnWhitelistedChild,
        Erc998EventSignature.WhitelistedChild,
      ],
    });
  }
}
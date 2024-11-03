import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Erc1363EventType, Erc721EventSignature, ModuleType, TokenType, VestingEventSignature } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { VestingABI } from "./interfaces";

@Injectable()
export class VestingBoxServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.VESTING,
      contractType: TokenType.ERC721,
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ModuleType.VESTING,
      contractAddress: address,
      contractInterface: VestingABI,
      eventSignatures: [
        Erc721EventSignature.Approval,
        Erc721EventSignature.ApprovalForAll,
        Erc721EventSignature.Transfer,
        VestingEventSignature.ERC20Released,
        VestingEventSignature.EtherReleased,
        VestingEventSignature.TransferReceived,
        VestingEventSignature.PaymentReceived,
        Erc1363EventType.TransferReceived,
      ],
    });
  }
}

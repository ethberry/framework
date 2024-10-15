import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import { AccessControlEventSignature, Erc1363EventType, ModuleType, VestingEventType } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { VestingABI } from "./interfaces";

@Injectable()
export class VestingServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.VESTING,
      contractType: IsNull(),
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.VESTING,
      contractAddress: address,
      contractInterface: VestingABI,
      eventSignatures: [
        VestingEventType.ERC20Released,
        VestingEventType.EtherReleased,
        VestingEventType.PaymentReceived,
        Erc1363EventType.TransferReceived,
        // extensions
        AccessControlEventSignature.OwnershipTransferred,
      ],
    });
  }
}

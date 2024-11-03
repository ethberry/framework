import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import { Erc1363EventType, ModuleType, LegacyVestingEventType } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { LegacyVestingABI } from "./interfaces";

@Injectable()
export class LegacyVestingServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.LEGACY_VESTING,
      contractType: IsNull(),
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.VESTING,
      contractAddress: address,
      contractInterface: LegacyVestingABI,
      eventSignatures: [
        LegacyVestingEventType.ERC20Released,
        LegacyVestingEventType.EtherReleased,
        LegacyVestingEventType.PaymentReceived,
        LegacyVestingEventType.TransferReceived,
        Erc1363EventType.TransferReceived,
      ],
    });
  }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { ContractType, ModuleType, PaymentSplitterEventSignature } from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { PaymentSplitterABI } from "./interfaces";

@Injectable()
export class PaymentSplitterServiceLog {
  constructor(
    private readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.PAYMENT_SPLITTER,
      contractType: IsNull(),
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.PAYMENT_SPLITTER,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: PaymentSplitterABI,
      eventSignatures: [
        PaymentSplitterEventSignature.PayeeAdded,
        PaymentSplitterEventSignature.PaymentReceived,
        PaymentSplitterEventSignature.PaymentReleased,
        PaymentSplitterEventSignature.ERC20PaymentReleased,
      ],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.PAYMENT_SPLITTER,
        contractAddress: address,
        contractInterface: PaymentSplitterABI,
        eventSignatures: [
          PaymentSplitterEventSignature.PayeeAdded,
          PaymentSplitterEventSignature.PaymentReceived,
          PaymentSplitterEventSignature.PaymentReleased,
          PaymentSplitterEventSignature.ERC20PaymentReleased,
        ],
      },
      blockNumber,
    );
  }
}

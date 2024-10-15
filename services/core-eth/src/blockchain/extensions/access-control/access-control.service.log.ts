import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { AccessControlEventSignature, ContractSecurity } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { AccessControlABI } from "./interfaces";

@Injectable()
export class AccessControlServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractSecurity: ContractSecurity.ACCESS_CONTROL,
      chainId,
    });

    this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.ACCESS_CONTROLL,
      contractAddress: address,
      contractInterface: AccessControlABI,
      eventSignatures: [
        AccessControlEventSignature.RoleGranted,
        AccessControlEventSignature.RoleRevoked,
        AccessControlEventSignature.RoleAdminChanged,
      ],
    });
  }

  public readLastBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.getPastEvents(
      [
        {
          contractType: ContractType.ACCESS_CONTROLL,
          contractAddress: address,
          contractInterface: AccessControlABI,
          eventSignatures: [
            AccessControlEventSignature.RoleGranted,
            AccessControlEventSignature.RoleRevoked,
            AccessControlEventSignature.RoleAdminChanged,
          ],
        },
      ],
      blockNumber,
      blockNumber,
    );
  }
}

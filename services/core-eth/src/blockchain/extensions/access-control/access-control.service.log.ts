import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import { AccessControlEventSignature, ContractSecurity } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { AccessControlABI, OwnableABI } from "./interfaces";

@Injectable()
export class AccessControlServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities1 = await this.contractService.findAll({
      contractSecurity: ContractSecurity.ACCESS_CONTROL,
      chainId,
    });

    this.updateRegistry(
      contractEntities1.filter(c => c.address !== wallet).map(c => c.address),
      ContractSecurity.ACCESS_CONTROL,
    );

    const contractEntities2 = await this.contractService.findAll({
      contractSecurity: ContractSecurity.OWNABLE,
      chainId,
    });

    this.updateRegistry(
      contractEntities2.filter(c => c.address !== wallet).map(c => c.address),
      ContractSecurity.OWNABLE,
    );
  }

  public updateRegistry(address: Array<string>, securityType: ContractSecurity): void {
    switch (securityType) {
      case ContractSecurity.ACCESS_CONTROL:
        return this.ethersService.updateRegistry({
          contractType: ContractType.ACCESS_CONTROLL,
          contractAddress: address,
          contractInterface: AccessControlABI,
          eventSignatures: [
            AccessControlEventSignature.RoleGranted,
            AccessControlEventSignature.RoleRevoked,
            AccessControlEventSignature.RoleAdminChanged,
          ],
        });
      case ContractSecurity.OWNABLE:
        return this.ethersService.updateRegistry({
          contractType: ContractType.OWNABLE,
          contractAddress: address,
          contractInterface: OwnableABI,
          eventSignatures: [AccessControlEventSignature.OwnershipTransferred],
        });
      default:
        throw new BadRequestException("unsupportedSecurityType");
    }
  }

  public readLastBlock(address: Array<string>, blockNumber: number, securityType: ContractSecurity): Promise<void> {
    switch (securityType) {
      case ContractSecurity.ACCESS_CONTROL:
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
      case ContractSecurity.OWNABLE:
        return this.ethersService.getPastEvents(
          [
            {
              contractType: ContractType.OWNABLE,
              contractAddress: address,
              contractInterface: OwnableABI,
              eventSignatures: [AccessControlEventSignature.OwnershipTransferred],
            },
          ],
          blockNumber,
          blockNumber,
        );
      default:
        throw new BadRequestException("unsupportedSecurityType");
    }
  }
}

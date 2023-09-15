import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IAccessControlRoleAdminChangedEvent,
  IAccessControlRoleGrantedEvent,
  IAccessControlRoleRevokedEvent,
  IOwnershipTransferredEvent,
} from "@framework/types";
import { AccessControlRoleHash, AccessControlRoleType, ContractStatus, ModuleType } from "@framework/types";

import { AccessControlService } from "./access-control.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class AccessControlServiceEth {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly contractService: ContractService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async roleGranted(event: ILogEvent<IAccessControlRoleGrantedEvent>, context: Log): Promise<void> {
    const {
      args: { role, account },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessControlService.create({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      role: Object.values(AccessControlRoleType)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ],
    });
  }

  public async roleRevoked(event: ILogEvent<IAccessControlRoleRevokedEvent>, context: Log): Promise<void> {
    const {
      args: { role, account },
    } = event;
    const { address } = context;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessControlService.delete({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      role: Object.values(AccessControlRoleType)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ],
    });

    if (role === AccessControlRoleHash.MINTER_ROLE.toString()) {
      const systemContractEntity = await this.contractService.findOne({ address: account.toLowerCase() });
      if (!systemContractEntity) {
        throw new NotFoundException("contractNotFound");
      }
      // if revoked from Exchange - make contract inactive
      if (systemContractEntity.contractModule === ModuleType.EXCHANGE) {
        const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

        if (!contractEntity) {
          throw new NotFoundException("contractNotFound");
        }
        Object.assign(contractEntity, { contractStatus: ContractStatus.INACTIVE });
        await contractEntity.save();
      }
    }
  }

  public async roleAdminChanged(event: ILogEvent<IAccessControlRoleAdminChangedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }

  public async ownershipTransferred(event: ILogEvent<IOwnershipTransferredEvent>, context: Log): Promise<void> {
    const {
      args: { newOwner, previousOwner },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessControlService.delete({
      address: context.address.toLowerCase(),
      account: previousOwner.toLowerCase(),
      role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
    });

    await this.accessControlService.create({
      address: context.address.toLowerCase(),
      account: newOwner.toLowerCase(),
      role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
    });
  }
}

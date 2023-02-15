import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlRoleHash,
  AccessControlRoleType,
  IAccessControlRoleAdminChangedEvent,
  IAccessControlRoleGrantedEvent,
  IAccessControlRoleRevokedEvent,
  IOwnershipTransferredEvent,
} from "@framework/types";

import { AccessControlService } from "./access-control.service";
import { EventHistoryService } from "../../event-history/event-history.service";

@Injectable()
export class AccessControlServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly accessControlService: AccessControlService,
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

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessControlService.delete({
      address: context.address.toLowerCase(),
      account: account.toLowerCase(),
      role: Object.values(AccessControlRoleType)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ],
    });
  }

  public async roleAdminChanged(event: ILogEvent<IAccessControlRoleAdminChangedEvent>, context: Log): Promise<void> {
    const {
      args: { role, newAdminRole },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessControlService.create({
      address: context.address.toLowerCase(),
      account: newAdminRole.toLowerCase(),
      role: Object.values(AccessControlRoleType)[
        Object.values(AccessControlRoleHash).indexOf(role as AccessControlRoleHash)
      ],
    });
  }

  public async ownershipChanged(event: ILogEvent<IOwnershipTransferredEvent>, context: Log): Promise<void> {
    const {
      args: { newOwner /* previousOwner */ },
    } = event;

    await this.eventHistoryService.updateHistory(event, context);

    await this.accessControlService.create({
      address: context.address.toLowerCase(),
      account: newOwner.toLowerCase(),
      role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
    });
  }
}

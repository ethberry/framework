import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  AccessControlRoleHash,
  AccessControlRoleType,
  IAccessControlRoleAdminChangedEvent,
  IAccessControlRoleGrantedEvent,
  IAccessControlRoleRevokedEvent,
  IErc4907UpdateUserEvent,
  IOwnershipTransferredEvent,
} from "@framework/types";

import { AccessControlService } from "./access-control.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { NotificatorService } from "../../../game/notificator/notificator.service";

@Injectable()
export class AccessControlServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly accessControlService: AccessControlService,
    private readonly tokenService: TokenService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
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

  public async updateUser(event: ILogEvent<IErc4907UpdateUserEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId, user, expires },
    } = event;
    const { address } = context;
    const erc721TokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    this.notificatorService.setUser({ tokenId, user, expires });
  }
}

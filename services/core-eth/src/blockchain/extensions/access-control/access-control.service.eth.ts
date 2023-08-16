import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import {
  AccessControlRoleHash,
  AccessControlRoleType,
  ContractStatus,
  IAccessControlRoleAdminChangedEvent,
  IAccessControlRoleGrantedEvent,
  IAccessControlRoleRevokedEvent,
  IErc4907UpdateUserEvent,
  IOwnershipTransferredEvent,
  ModuleType,
} from "@framework/types";

import { AccessControlService } from "./access-control.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { NotificatorService } from "../../../game/notificator/notificator.service";
import { ContractService } from "../../hierarchy/contract/contract.service";

@Injectable()
export class AccessControlServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly accessControlService: AccessControlService,
    private readonly tokenService: TokenService,
    private readonly contractService: ContractService,
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
      if (
        systemContractEntity.contractModule === ModuleType.EXCHANGE ||
        systemContractEntity.contractModule === ModuleType.CONTRACT_MANAGER
      ) {
        const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

        if (!contractEntity) {
          throw new NotFoundException("contractNotFound");
        }
        Object.assign(contractEntity, { contractStatus: ContractStatus.INACTIVE });
        await contractEntity.save();
      }
    }
    // TODO somehow disable grade buttons if MinterRole revoked - add checkRole endpoint
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

  public async updateUser(event: ILogEvent<IErc4907UpdateUserEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId, user, expires },
    } = event;
    const { address } = context;
    const erc721TokenEntity = await this.tokenService.getToken(Number(tokenId).toString(), address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, erc721TokenEntity.id);

    await this.notificatorService.updateUser({
      merchantId: erc721TokenEntity.template.contract.merchantId,
      tokenId,
      user,
      expires,
    });
  }
}

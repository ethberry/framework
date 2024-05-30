import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { BalanceEntity } from "../../hierarchy/balance/balance.entity";
import { AccessControlEntity } from "./access-control.entity";
import type { IAccessControlCheckDto, IAccessControlCheckTokenOwnershipDto } from "./interfaces";

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(AccessControlEntity)
    private readonly accessControlEntityRepository: Repository<AccessControlEntity>,
    @InjectRepository(BalanceEntity)
    private readonly balanceEntityRepository: Repository<BalanceEntity>,
  ) {}

  public count(where: FindOptionsWhere<AccessControlEntity>): Promise<number> {
    return this.accessControlEntityRepository.count({ where });
  }

  public countBalance(where: FindOptionsWhere<BalanceEntity>): Promise<number> {
    return this.balanceEntityRepository.count({ where });
  }

  public async check(dto: IAccessControlCheckDto): Promise<{ hasRole: boolean }> {
    const count = await this.count(dto);
    return { hasRole: count > 0 };
  }

  public async checkTokenOwnership(dto: IAccessControlCheckTokenOwnershipDto): Promise<{ hasOwnership: boolean }> {
    const countBalance = await this.countBalance(dto);
    return { hasOwnership: countBalance > 0 };
  }
}

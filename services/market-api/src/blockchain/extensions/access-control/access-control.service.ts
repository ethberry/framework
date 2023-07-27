import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { AccessControlEntity } from "./access-control.entity";
import { IAccessControlCheck } from "./interfaces";

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(AccessControlEntity)
    private readonly accessControlEntityRepository: Repository<AccessControlEntity>,
  ) {}

  public count(where: FindOptionsWhere<AccessControlEntity>): Promise<number> {
    return this.accessControlEntityRepository.count({ where });
  }

  public async check(dto: IAccessControlCheck): Promise<{ hasRole: boolean }> {
    const count = await this.count(dto);
    return { hasRole: count > 0 };
  }
}
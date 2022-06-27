import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniTemplateEntity } from "./token.entity";

@Injectable()
export class Erc20TokenService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly erc20TokenEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniTemplateEntity>,
    options?: FindOneOptions<UniTemplateEntity>,
  ): Promise<UniTemplateEntity | null> {
    return this.erc20TokenEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<UniTemplateEntity>,
    options?: FindOneOptions<UniTemplateEntity>,
  ): Promise<Array<UniTemplateEntity>> {
    return this.erc20TokenEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<UniTemplateEntity>): Promise<UniTemplateEntity> {
    return this.erc20TokenEntityRepository.create(dto).save();
  }
}

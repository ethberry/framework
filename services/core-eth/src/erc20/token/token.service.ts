import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Injectable()
export class Erc20TokenService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly erc20TokenEntityRepository: Repository<TemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.erc20TokenEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<Array<TemplateEntity>> {
    return this.erc20TokenEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<TemplateEntity>): Promise<TemplateEntity> {
    return this.erc20TokenEntityRepository.create(dto).save();
  }
}

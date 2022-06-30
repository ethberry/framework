import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { TemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Injectable()
export class Erc998TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly erc998TemplateEntityRepository: Repository<TemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.erc998TemplateEntityRepository.findOne({ where, ...options });
  }
}

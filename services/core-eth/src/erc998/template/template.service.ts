import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template.entity";


@Injectable()
export class Erc998TemplateService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly erc998TemplateEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniTemplateEntity>,
    options?: FindOneOptions<UniTemplateEntity>,
  ): Promise<UniTemplateEntity | null> {
    return this.erc998TemplateEntityRepository.findOne({ where, ...options });
  }
}

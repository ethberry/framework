import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { TemplateEntity } from "./template.entity";

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly erc721TemplateEntityRepository: Repository<TemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.erc721TemplateEntityRepository.findOne({ where, ...options });
  }
}

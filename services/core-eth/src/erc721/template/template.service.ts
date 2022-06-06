import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721TemplateEntity } from "./template.entity";

@Injectable()
export class Erc721TemplateService {
  constructor(
    @InjectRepository(Erc721TemplateEntity)
    private readonly erc721TemplateEntityRepository: Repository<Erc721TemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc721TemplateEntity>,
    options?: FindOneOptions<Erc721TemplateEntity>,
  ): Promise<Erc721TemplateEntity | null> {
    return this.erc721TemplateEntityRepository.findOne({ where, ...options });
  }
}

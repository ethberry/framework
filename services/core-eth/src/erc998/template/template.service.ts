import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998TemplateEntity } from "./template.entity";

@Injectable()
export class Erc998TemplateService {
  constructor(
    @InjectRepository(Erc998TemplateEntity)
    private readonly erc998TemplateEntityRepository: Repository<Erc998TemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc998TemplateEntity>,
    options?: FindOneOptions<Erc998TemplateEntity>,
  ): Promise<Erc998TemplateEntity | null> {
    return this.erc998TemplateEntityRepository.findOne({ where, ...options });
  }
}

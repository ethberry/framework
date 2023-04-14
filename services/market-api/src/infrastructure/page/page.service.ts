import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { PageEntity } from "./page.entity";

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageEntityRepository: Repository<PageEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<PageEntity>,
    options?: FindOneOptions<PageEntity>,
  ): Promise<PageEntity | null> {
    return this.pageEntityRepository.findOne({ where, ...options });
  }
}

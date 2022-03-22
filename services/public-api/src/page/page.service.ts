import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { PageEntity } from "./page.entity";

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageEntityRepository: Repository<PageEntity>,
  ) {}

  public findOne(where: FindOptionsWhere<PageEntity>): Promise<PageEntity | null> {
    return this.pageEntityRepository.findOne({ where });
  }
}

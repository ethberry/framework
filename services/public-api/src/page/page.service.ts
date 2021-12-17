import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, Repository } from "typeorm";

import { PageEntity } from "./page.entity";

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageEntityRepository: Repository<PageEntity>,
  ) {}

  public findOne(where: FindConditions<PageEntity>): Promise<PageEntity | undefined> {
    return this.pageEntityRepository.findOne({ where });
  }
}

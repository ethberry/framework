import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";

import { WaitListListEntity } from "./list.entity";

@Injectable()
export class WaitListListService {
  constructor(
    @InjectRepository(WaitListListEntity)
    private readonly waitlistListEntityRepository: Repository<WaitListListEntity>,
  ) {}

  public async autocomplete(): Promise<Array<WaitListListEntity>> {
    return this.waitlistListEntityRepository.find({
      where: {
        root: IsNull(),
      },
      select: {
        id: true,
        title: true,
      },
    });
  }
}

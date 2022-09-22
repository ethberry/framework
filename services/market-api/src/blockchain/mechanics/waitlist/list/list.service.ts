import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { WaitlistListEntity } from "./list.entity";

@Injectable()
export class WaitlistListService {
  constructor(
    @InjectRepository(WaitlistListEntity)
    private readonly waitlistListEntityRepository: Repository<WaitlistListEntity>,
  ) {}

  public async autocomplete(): Promise<Array<WaitlistListEntity>> {
    return this.waitlistListEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ClaimEntity } from "./claim.entity";

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ClaimEntity>,
    options?: FindOneOptions<ClaimEntity>,
  ): Promise<ClaimEntity | null> {
    return this.claimEntityRepository.findOne({ where, ...options });
  }
}

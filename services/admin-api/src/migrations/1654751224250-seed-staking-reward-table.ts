import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedStakingRewardTable1654751224250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.staking_reward (
        token_type,
        collection,
        token_id,
        amount,
        staking_id
      ) VALUES (
        'ERC721D',
        2,
        1,
        null,
        2
      ), (
        'ERC721',
        3,
        1,
        null,
        1
      ), (
        'ERC1155',
        1,
        1,
        '${constants.WeiPerEther.toString()}',
        3
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_reward`);
  }
}

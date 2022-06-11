import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedStakingDepositTable1654751224230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.staking_deposit (
        token_type,
        collection,
        criteria,
        amount,
        staking_id
      ) VALUES (
        'NATIVE',
        1,
        null,
        '${constants.WeiPerEther.toString()}',
        1
      ), (
        'ERC20',
        2,
        null,
        '${constants.WeiPerEther.toString()}',
        2
      ), (
        'ERC721',
        3,
        1,
        null,
        3
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_deposit`);
  }
}

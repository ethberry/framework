import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedStakingDepositTable1654751224230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.staking_rule_deposit (
        token_type,
        collection,
        token_id,
        amount,
        staking_id
      ) VALUES (
        'NATIVE',
        1,
        0,
        '${constants.WeiPerEther.toString()}',
        1
      ), (
        'ERC20',
        1,
        0,
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
    await queryRunner.dropTable(`${ns}.staking_rule_deposit`);
  }
}

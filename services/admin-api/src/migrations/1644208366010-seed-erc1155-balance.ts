import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedErc1155Balance1644208366010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.erc1155_balance (
        wallet,
        amount,
        erc1155_token_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        '${constants.WeiPerEther.toString()}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${constants.WeiPerEther.toString()}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${constants.WeiPerEther.toString()}',
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc1155_balance RESTART IDENTITY CASCADE;`);
  }
}

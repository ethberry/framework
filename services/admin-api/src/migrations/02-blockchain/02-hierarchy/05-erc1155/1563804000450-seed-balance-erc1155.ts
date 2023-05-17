import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc1155At1563804020450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc998ContractOwnerErc1155Address = process.env.ERC998_OWNER_ERC1155_ADDR || wallet;
    const erc998ContractOwnerErc1155Erc20Address = process.env.ERC998_OWNER_ERC1155_ERC20_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        target_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        100,
        15010101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Address}',
        1000,
        15010101,
        14120101, -- erc1155 owner
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Erc20Address}',
        1000,
        15010101,
        14130101, -- erc20 + erc1155 owner
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15010201,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15010301,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15040101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15040201,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15040301,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        25010101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}

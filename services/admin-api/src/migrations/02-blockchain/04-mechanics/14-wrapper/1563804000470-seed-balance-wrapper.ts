import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc721WrapperAt1563804020470 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const erc721ContractWrapperAddress = process.env.ERC721_WRAPPER_ADDR || wallet;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        1,
        17010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        11010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        12010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        13010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        14010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        15010101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}

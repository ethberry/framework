import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

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
        target_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        1,
        112010101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        '${WeiPerEther.toString()}',
        101010101,
        112010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        '${WeiPerEther.toString()}',
        102010101, -- Space Credits
        112010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        112010102,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        103010101,
        112010102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        104010101,
        112010102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        112010103,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1000,
        105010101,
        112010103,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}

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
        17010101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        '${WeiPerEther.toString()}',
        11010101,
        17010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        '${WeiPerEther.toString()}',
        12010101,
        17010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        17010102,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        13010101,
        17010102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1,
        14010101,
        17010102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        17010103,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc721ContractWrapperAddress}',
        1000,
        15010101,
        17010103,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}

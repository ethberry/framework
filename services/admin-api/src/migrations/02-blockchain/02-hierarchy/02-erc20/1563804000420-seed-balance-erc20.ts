import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc20At1563804020420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc998ContractOwnerErc20Address = process.env.ERC998_OWNER_ERC20_ADDR || wallet;
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
        '${WeiPerEther.toString()}',
        12010101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc20Address}',
        '${WeiPerEther.toString()}',
        12010101,
        14110101, -- erc20 owner
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Erc20Address}',
        '${WeiPerEther.toString()}',
        12010101,
        14130101, -- erc20 + erc1155 owner
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${WeiPerEther.toString()}',
        12010101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${WeiPerEther.toString()}',
        12150101,
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

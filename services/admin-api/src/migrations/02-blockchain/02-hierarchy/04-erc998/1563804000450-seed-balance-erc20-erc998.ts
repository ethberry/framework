import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedBalanceErc20Erc998At1563804020450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

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
        '${erc998ContractOwnerErc20Address}',
        '${WeiPerEther.toString()}',
        102010101, -- Space Credits
        104110101, -- erc20 owner
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractOwnerErc1155Erc20Address}',
        '${WeiPerEther.toString()}',
        102010101, -- Space Credits
        104130101, -- erc20 + erc1155 owner
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}

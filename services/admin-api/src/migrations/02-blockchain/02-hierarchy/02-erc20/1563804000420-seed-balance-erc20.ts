import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedBalanceErc20At1563804020420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

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
        '${wallets[0]}',
        '${WeiPerEther.toString()}',
        102010101, -- Space Credits
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${WeiPerEther.toString()}',
        102010101, -- Space Credits
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        '${WeiPerEther.toString()}',
        102010101, -- Space Credits
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${WeiPerEther.toString()}',
        102800101, -- Warp Credits
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${WeiPerEther.toString()}',
        102800101, -- Warp Credits
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        '${WeiPerEther.toString()}',
        102800101, -- Warp Credits
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

import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedBalancePonziAt1663047650530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const ponziAddress = process.env.PONZI_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${ponziAddress}',
        '${(100n * WeiPerEther).toString()}',
        101010101, -- BESU
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${ponziAddress}',
        '${(100n * WeiPerEther).toString()}',
        102010101, -- Space Credits
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}

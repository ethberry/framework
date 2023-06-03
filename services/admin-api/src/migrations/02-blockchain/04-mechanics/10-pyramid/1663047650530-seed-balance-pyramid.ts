import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalancePyramidAt1663047650530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const pyramidAddress = process.env.PYRAMID_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${pyramidAddress}',
        '${(100n * WeiPerEther).toString()}',
        11010101, -- BESU
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${pyramidAddress}',
        '${(100n * WeiPerEther).toString()}',
        12010101, -- Space Credits
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}

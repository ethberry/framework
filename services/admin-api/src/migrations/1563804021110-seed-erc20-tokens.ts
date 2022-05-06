import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedErc20Token1563804021110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc20TokenAddress = process.env.ERC20_COIN || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.erc20_token (
        title,
        description,
        token_status,
        amount,
        symbol,
        address,
        permission_type,
        created_at,
        updated_at
      ) VALUES (
        'Old good space credits',
        '${simpleFormatting}',
        'ACTIVE',
        '${constants.WeiPerEther.toString()}',
        'TREJ',
        '${erc20TokenAddress}',
        'ACCESS_CONTROL',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc20_token RESTART IDENTITY CASCADE;`);
  }
}

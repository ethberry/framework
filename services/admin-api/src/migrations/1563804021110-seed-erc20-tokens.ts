import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedErc20Token1563804021110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc20TokenAddress = process.env.ERC20_COIN || wallet;
    const chainId = process.env.CHAIN_ID || 1;

    await queryRunner.query(`
      INSERT INTO ${ns}.erc20_token (
        title,
        description,
        amount,
        name,
        symbol,
        address,
        token_status,
        contract_template,
        chain_id,
        created_at,
        updated_at
      ) VALUES (
        'Space Credits',
        '${simpleFormatting}',
        '${constants.WeiPerEther.toString()}',
        'Space Credits',
        'GEM20',
        '${erc20TokenAddress}',
        'ACTIVE',
        'SIMPLE',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc20_token RESTART IDENTITY CASCADE;`);
  }
}

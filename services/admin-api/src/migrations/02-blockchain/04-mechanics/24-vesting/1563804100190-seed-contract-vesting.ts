import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { NodeEnv } from "@ethberry/constants";
import { imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractVestingAt1563804100190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        VESTING_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const vestingAddress = process.env.VESTING_ADDR;
    const chainId = process.env.CHAIN_ID_GEMUNION || process.env.CHAIN_ID_GEMUNION_BESU || testChainId;

    await queryRunner.query(`
      INSERT INTO ${ns}.contract (
        id,
        address,
        chain_id,
        title,
        description,
        image_url,
        name,
        symbol,
        base_token_uri,
        parameters,
        contract_status,
        contract_type,
        contract_features,
        contract_module,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        12801,
        '${vestingAddress}',
        '${chainId}',
        'VESTING',
        '${simpleFormatting}',
        '${imageUrl}',
        'Vesting',
        '',
        '',
        '{}',
        'ACTIVE',
        'ERC721',
        '{}',
        'VESTING',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}

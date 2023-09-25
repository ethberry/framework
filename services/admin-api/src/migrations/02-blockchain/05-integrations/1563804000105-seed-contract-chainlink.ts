import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractChainLinkAt1563804000105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const vrfAddress = process.env.VRF_ADDR || wallet;
    const vrfAddressBinance = process.env.VRF_BINANCE_ADDR || wallet;
    const fromBlock = process.env.STARTING_BLOCK || 1;
    const fromBlockBinance = process.env.STARTING_BINANCE_BLOCK || 1;

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
        contract_status,
        contract_type,
        contract_features,
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 107},
        '${vrfAddress.toLowerCase()}',
        '${chainId}',
        'VRF COORDINATOR',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        'ACTIVE',
        null,
        '{}',
        'CHAIN_LINK',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 207},
        '${vrfAddressBinance.toLowerCase()}',
        ${process.env.NODE_ENV === NodeEnv.production ? 56 : 97},
        'VRF COORDINATOR (BNB)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        'ACTIVE',
        null,
        '{}',
        'CHAIN_LINK',
        '${fromBlockBinance}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}

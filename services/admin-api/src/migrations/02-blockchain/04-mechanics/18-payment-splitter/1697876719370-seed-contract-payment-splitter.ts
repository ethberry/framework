import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { baseTokenURI } from "@gemunion/contracts-constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractPaymentSplitterAt1697876719370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const paymentSplitterAddress = process.env.PAYMENT_SPLITTER_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;

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
        royalty,
        base_token_uri,
        parameters,
        contract_status,
        contract_features,
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        18101,
        '${paymentSplitterAddress}',
        '${chainId}',
        'PAYMENT SPLITTER',
        '${simpleFormatting}',
        '${imageUrl}',
        'PS',
        'PS',
        100,
        '${baseTokenURI}',
        '${JSON.stringify({
          payees: [wallet],
          shares: [100],
        })}',
        'ACTIVE',
        '{}',
        'PAYMENT_SPLITTER',
        '${fromBlock}',
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

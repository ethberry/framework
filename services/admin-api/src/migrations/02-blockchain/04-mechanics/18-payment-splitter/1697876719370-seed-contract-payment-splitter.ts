import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { wallet, NodeEnv } from "@ethberry/constants";
import { baseTokenURI } from "@ethberry/contracts-constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractPaymentSplitterAt1697876719370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        PAYMENT_SPLITTER_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const paymentSplitterAddress = process.env.PAYMENT_SPLITTER_ADDR;
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;

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

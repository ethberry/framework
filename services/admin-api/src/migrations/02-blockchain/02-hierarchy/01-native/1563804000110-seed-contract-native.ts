import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId, imagePath } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractNativeAt1563804000110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;

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
        decimals,
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        ${process.env.NODE_ENV === NodeEnv.production ? 1 : 10101},
        '${ZeroAddress}',
        '${chainId}',
        'Native token (BESU)',
        '${simpleFormatting}',
        '${imagePath}/besu.png',
        'Besu',
        'BESU',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 2 : 10102},
        '${ZeroAddress}',
        '${chainId}',
        'Inactive token (BESU)',
        '${simpleFormatting}',
        '${imagePath}/besu.png',
        'Ethereum',
        'ETH',
        18,
        0,
        '',
        'INACTIVE',
        'NATIVE',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 3 : 20101},
        '${ZeroAddress}',
        56,
        'Native token (BNB)',
        '${simpleFormatting}',
        '${imagePath}/bnb.png',
        'Binance',
        'BNB',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 4 : 30101},
        '${ZeroAddress}',
        1,
        'Native token (ETH)',
        '${simpleFormatting}',
        '${imagePath}/ethereum.png',
        'Ethereum',
        'ETH',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 5 : 40101},
        '${ZeroAddress}',
        137,
        'Native token (MATIC)',
        '${simpleFormatting}',
        '${imagePath}/polygon.png',
        'Matic',
        'MATIC',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ),(
        ${process.env.NODE_ENV === NodeEnv.production ? 6 : 50101},
        '${ZeroAddress}',
        80002,
        'Native token (Amoy)',
        '${simpleFormatting}',
        '${imagePath}/polygon.png',
        'Matic',
        'MATIC',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 7 : 60101},
        '${ZeroAddress}',
        56,
        'Native token (BNBt)',
        '${simpleFormatting}',
        '${imagePath}/bnb.png',
        'Binance-testnet',
        'BNB',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

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
        decimals,
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        10108,
        '${ZeroAddress}',
        '${chainId}',
        'FAKE',
        '${simpleFormatting}',
        '${imagePath}/besu.png',
        'Ethereum',
        'ETH',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{EXTERNAL}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}

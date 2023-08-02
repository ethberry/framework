import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";

export class SeedContractNativeAt1563804000110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // if (process.env.NODE_ENV === "production") {
    //   return;
    // }

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
        10101,
        '${ZeroAddress}',
        '${chainId}',
        'Native token (BESU)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbesu.png?alt=media&token=3a4e0d2c-ffdc-44a2-ac84-1921d71e0d2d',
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
        10102,
        '${ZeroAddress}',
        '${chainId}',
        'Inactive token (BESU)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbesu.png?alt=media&token=3a4e0d2c-ffdc-44a2-ac84-1921d71e0d2d',
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
        20101,
        '${ZeroAddress}',
        56,
        'Native token (BNB)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbnb.png?alt=media&token=f9eca8af-77b1-4092-8d4e-91fb897efa18',
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
        30101,
        '${ZeroAddress}',
        '1',
        'Native token (ETH)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fethereum.png?alt=media&token=fc22334a-6cc4-4f1e-b41c-4ef3a059f6ff',
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
        40101,
        '${ZeroAddress}',
        '137',
        'Native token (MATIC)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fpolygon.png?alt=media&token=5eabc13d-8759-4b49-96be-86a0ddf3921f',
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
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}

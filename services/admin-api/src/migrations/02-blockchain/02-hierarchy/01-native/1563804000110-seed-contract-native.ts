import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";

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
        1101,
        '${constants.AddressZero}',
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
        '{}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1102,
        '${constants.AddressZero}',
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
        '{}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2101,
        '${constants.AddressZero}',
        56,
        'Native token (BNB)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
        'Binance',
        'BNB',
        18,
        0,
        '',
        'ACTIVE',
        'NATIVE',
        '{}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3101,
        '${constants.AddressZero}',
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
        '{}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4101,
        '${constants.AddressZero}',
        '137',
        'Native token (MATIC)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fpolygon.png?alt=media&token=5eabc13d-8759-4b49-96be-86a0ddf3921f',
        'Matic',
        'MATIC',
        18,
        0,
        '',
        'INACTIVE',
        'NATIVE',
        '{}',
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

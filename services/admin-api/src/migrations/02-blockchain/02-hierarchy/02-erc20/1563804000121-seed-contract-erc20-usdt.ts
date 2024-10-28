import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { NodeEnv } from "@ethberry/constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imagePath, ns, testChainId } from "@framework/constants";

export class SeedContractErc20UsdtAt1563804000121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        USDT_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;
    const usdtAddr = process.env.USDT_ADDR;
    const usdtImgUrl = `${imagePath}/usdt.png`;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 11 : 10215},
        '${usdtAddr}',
        '${chainId}',
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 12 : 20215},
        '0x55d398326f99059ff775485246999027b3197955',
        56,
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        'Tether USD',
        'USDT',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 13 : 30215},
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        1,
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 14 : 40215},
        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        137,
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 15 : 50215},
        '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
        97,
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        'Tether USD',
        'USDT',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 16 : 60215},
        '0x1616d425cd540b256475cbfb604586c8598ec0fb',
        80002,
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
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

import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet, ZeroAddress } from "ethers";
import { populate } from "dotenv";

import { NodeEnv } from "@ethberry/constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imagePath, ns, testChainId } from "@framework/constants";

export class SeedContractErc20UsdcAt1563804000125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        USDC_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;
    const usdcAddr = process.env.USDC_ADDR;
    const usdcImgUrl = `${imagePath}/usdc.png`;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 51 : 10219},
        '${usdcAddr}',
        '${chainId}',
        'USDC',
        '${simpleFormatting}',
        '${usdcImgUrl}',
        'USD Coin',
        'USDC',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 52 : 20219},
        '${ZeroAddress}',
        56,
        'USDC',
        '${simpleFormatting}',
        '${usdcImgUrl}',
        'USD Coin',
        'USDC',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 53 : 30219},
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        1,
        'USDC',
        '${simpleFormatting}',
        '${usdcImgUrl}',
        'USD Coin',
        'USDC',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 54 : 40219},
        '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        137,
        'USDC',
        '${simpleFormatting}',
        '${usdcImgUrl}',
        'USD Coin',
        'USDC',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 55 : 50219},
        '${ZeroAddress}',
        97,
        'USDC',
        '${simpleFormatting}',
        '${usdcImgUrl}',
        'USD Coin',
        'USDC',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 56 : 60219},
        '${ZeroAddress}',
        80002,
        'USDC',
        '${simpleFormatting}',
        '${usdcImgUrl}',
        'USD Coin',
        'USDC',
        18,
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
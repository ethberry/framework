import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { NodeEnv } from "@ethberry/constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imagePath, ns, testChainId } from "@framework/constants";

export class SeedContractErc20WethAt1563804000122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        WETH_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;
    const wethAddr = process.env.WETH_ADDR;
    const wethImgUrl = `${imagePath}/weth.png`;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 21 : 10216},
        '${wethAddr}',
        '${chainId}',
        'WETH',
        '${simpleFormatting}',
        '${wethImgUrl}',
        'Wrapped ETH',
        'WETH',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 22 : 20216},
        '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        56,
        'WBNB',
        '${simpleFormatting}',
        '${wethImgUrl}',
        'Wrapped BNB',
        'WBNB',
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
       ${process.env.NODE_ENV === NodeEnv.production ? 23 : 30216},
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        1,
        'WETH',
        '${simpleFormatting}',
        '${wethImgUrl}',
        'Wrapped ETH',
        'WETH',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 24 : 40216},
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        137,
        'WMATIC',
        '${simpleFormatting}',
        '${wethImgUrl}',
        'Wrapped MATIC',
        'WMATIC',
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

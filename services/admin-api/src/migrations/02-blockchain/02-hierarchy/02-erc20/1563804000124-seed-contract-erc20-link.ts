import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imagePath, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedContractErc20LINKAt1563804000124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    populate(
      process.env as any,
      {
        LINK_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const linkAddr = process.env.LINK_ADDR;
    const chainId = process.env.CHAIN_ID_GEMUNION_BESU || testChainId;
    const linkImgUrl = `${imagePath}/chainlink-coin-icon.png`;

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
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        ${process.env.NODE_ENV === NodeEnv.production ? 33 : 10218},
        '${linkAddr}',
        '${chainId}',
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        'ChainLink LINK',
        'LINK',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 34 : 20218},
        '0x404460C6A5EdE2D891e8297795264fDe62ADBB75',
        56,
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        'ChainLink LINK',
        'LINK',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 35 : 30218},
        '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        1,
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        'ChainLink LINK',
        'LINK',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 36 : 40218},
        '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
        137,
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        'ChainLink LINK',
        'LINK',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 37 : 50218},
        '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06',
        97,
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        'ChainLink LINK',
        'LINK',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 67 : 60218},
        '0x0fd9e8d3af1aaee056eb9e802c3a762a667b1904',
        80002,
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        'ChainLink LINK',
        'LINK',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
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

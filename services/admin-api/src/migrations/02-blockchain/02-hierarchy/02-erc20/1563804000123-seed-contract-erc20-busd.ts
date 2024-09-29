import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { NodeEnv } from "@ethberry/constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imagePath, ns, testChainId } from "@framework/constants";

export class SeedContractErc20BusdAt1563804000123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        BUSD_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const chainId = process.env.CHAIN_ID_GEMUNION || process.env.CHAIN_ID_GEMUNION_BESU || testChainId;
    const busdAddr = process.env.BUSD_ADDR;
    const busdImgUrl = `${imagePath}/busd.png`;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 31 : 10217},
        '${busdAddr}',
        '${chainId}',
        'BUSD',
        '${simpleFormatting}',
        '${busdImgUrl}',
        'Biance USD',
        'BUSD',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 32 : 20217},
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        56,
        'BUSD',
        '${simpleFormatting}',
        '${busdImgUrl}',
        'Biance USD',
        'BUSD',
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

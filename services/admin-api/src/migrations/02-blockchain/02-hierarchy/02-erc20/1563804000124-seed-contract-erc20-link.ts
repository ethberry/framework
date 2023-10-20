import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractErc20LINKAt1563804000124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const linkAddr = process.env.LINK_ADDR || wallet;

    // TODO add LINK for all supported networks (56 & 97 etc.)
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
        '${testChainId}',
        'LINK',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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

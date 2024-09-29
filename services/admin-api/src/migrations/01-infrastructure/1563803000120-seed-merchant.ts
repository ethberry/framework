import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { NodeEnv, wallets } from "@ethberry/constants";
import { imageUrl, ns, testChainId } from "@framework/constants";

export class SeedMerchant1563803000120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_GEMUNION || process.env.CHAIN_ID_GEMUNION_BESU || testChainId;

    await queryRunner.query(`
      INSERT INTO ${ns}.merchant (
        email,
        title,
        description,
        phone_number,
        image_url,
        merchant_status,
        wallet,
        api_key,
        rate_plan,
        created_at,
        updated_at
      ) VALUES (
        'trejgun@gmail.com',
        'GEMUNION',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'ACTIVE',
        '${chainId === testChainId ? wallets[0] : process.env.ACCOUNT}',
        '11111111-2222-3333-4444-555555555555',
        'GOLD',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`
      INSERT INTO ${ns}.merchant (
        email,
        title,
        description,
        phone_number,
        image_url,
        merchant_status,
        wallet,
        api_key,
        rate_plan,
        created_at,
        updated_at
      ) VALUES (
        'trejgun+merchant2@gemunion.io',
        'MEOW DOA',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'ACTIVE',
        '${wallets[1]}',
        '00010203-0405-0607-0809-0a0b0c0d0e0f',
        'SILVER',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+merchant3@gemunion.io',
        'CTAPbIu SHOP',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'ACTIVE',
        '${wallets[2]}',
        '12345678-1234-5678-1234-567812345678',
        'BRONZE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.merchant RESTART IDENTITY CASCADE;`);
  }
}

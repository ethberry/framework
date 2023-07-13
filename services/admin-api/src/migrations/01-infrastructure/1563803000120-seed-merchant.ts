import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { wallets } from "@gemunion/constants";
import { imageUrl, ns, testChainId } from "@framework/constants";

export class SeedMerchant1563803000120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = BigInt(process.env.CHAIN_ID || testChainId);

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
        created_at,
        updated_at
      ) VALUES (
        'trejgun@gemunion.io',
        'GEMUNION',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'ACTIVE',
        '${chainId === testChainId ? wallets[0] : process.env.ACCOUNT}',
        '11111111-2222-3333-4444-555555555555',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    if (process.env.NODE_ENV === "production") {
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
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+merchant3@gemunion.io',
        'CTAPbIu SHOP',
        '${simpleFormatting}',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'INACTIVE',
        '${wallets[2]}',
        '12345678-1234-5678-1234-567812345678',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.merchant RESTART IDENTITY CASCADE;`);
  }
}

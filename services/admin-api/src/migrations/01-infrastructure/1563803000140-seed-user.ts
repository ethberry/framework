import { MigrationInterface, QueryRunner } from "typeorm";

import { wallets } from "@gemunion/constants";
import { avatarWhiteUrl, avatarBlueUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedUser1563803000140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = BigInt(process.env.CHAIN_ID || testChainId);

    await queryRunner.query(`
      INSERT INTO ${ns}.user (
        email,
        sub,
        display_name,
        image_url,
        language,
        country,
        gender,
        comment,
        user_status,
        user_roles,
        merchant_id,
        wallet,
        chain_id,
        created_at,
        updated_at
      ) VALUES (
        'trejgun@gmail.com',
        'bPTD3jSwxTdqHWvlG0ek2WbHPJd2',
        'Trej Gun',
        '${avatarWhiteUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{SUPER,ADMIN,OWNER}',
        1,
        '${chainId === testChainId ? wallets[0] : process.env.ACCOUNT}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`
      INSERT INTO ${ns}.user (
        email,
        sub,
        display_name,
        image_url,
        language,
        country,
        gender,
        comment,
        user_status,
        user_roles,
        merchant_id,
        wallet,
        chain_id,
        created_at,
        updated_at
      ) VALUES (
        'trejgun@gemunion.io',
        'SbE0QAb34lhB1bBwoa62MpZW1qn1',
        'CTAPbIu_MABP',
        '${avatarBlueUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{ADMIN,OWNER}',
        2,
        '${wallets[1]}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'meowdao@gmail.com',
        's1dBg1j0WtOyRutwwJfCSBLurqi2',
        'Meow Dao',
        '${avatarBlueUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{ADMIN,OWNER}',
        3,
        '${wallets[2]}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'test1@gemunion.io',
        'qwerty',
        'Yuri',
        '${avatarBlueUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{MANAGER}',
        2,
        '0x01',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'test2@gemunion.io',
        'qwerty',
        'Arthur',
        '${avatarBlueUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{CUSTOMER}',
        2,
        '0x02',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'test3@gemunion.io',
        'qwerty',
        'Jenya',
        '${avatarBlueUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{CUSTOMER}',
        2,
        '0x03',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.user RESTART IDENTITY CASCADE;`);
  }
}

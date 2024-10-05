import { MigrationInterface, QueryRunner } from "typeorm";

import { NodeEnv, wallets } from "@ethberry/constants";
import { avatarWhiteUrl, ns, testChainId } from "@framework/constants";

export class SeedUser1563803000140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;

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
        'FQ607e6GOcgpS2vo5uMwIKImzq53',
        'TrejGun',
        '${avatarWhiteUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{SUPER,ADMIN,OWNER,MANAGER,CUSTOMER}',
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
        'trejgun@gmail.com',
        'SbE0QAb34lhB1bBwoa62MpZW1qn1',
        'CTAPbIu_MABP',
        '${avatarWhiteUrl}',
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
        '${avatarWhiteUrl}',
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
        '${avatarWhiteUrl}',
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
        '${avatarWhiteUrl}',
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
        '${avatarWhiteUrl}',
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

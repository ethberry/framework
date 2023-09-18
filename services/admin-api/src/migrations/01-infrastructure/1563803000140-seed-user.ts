import { MigrationInterface, QueryRunner } from "typeorm";

import { wallets } from "@gemunion/constants";
import { avatarWhiteUrl, ns, testChainId } from "@framework/constants";
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
        '${process.env.NODE_ENV === NodeEnv.production ? "gemunion@gemunion.io" : "trejgun@gmail.com"}',
        '${
          process.env.NODE_ENV === NodeEnv.production ? "Rme7AdwNfdMoXaje551gkRtJF402" : "nmuQTQhyQ1X5nla2i061Wsc4cIj1"
        }',
        'GemUnion Admin',
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

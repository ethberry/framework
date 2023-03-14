import { MigrationInterface, QueryRunner } from "typeorm";

import { wallets } from "@gemunion/constants";
import { imageUrl, ns, testChainId } from "@framework/constants";

export class SeedUser1563803000140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;

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
        'E5PnxZDsjEZcDzS9o2HlDGfmNzW2',
        'Trej Gun',
        '${imageUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{ADMIN,OWNER}',
        1,
        '${wallets[0]}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun@gemunion.io',
        'ia31Zjm8NUTstqI3Ug9mbHtiVbH2',
        'CTAPbIu_MABP',
        '${imageUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{ADMIN,OWNER}',
        1,
        '${wallets[1]}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'meowdao@gmail.com',
        's1dBg1j0WtOyRutwwJfCSBLurqi2',
        'Meow Dao',
        '${imageUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{ADMIN,OWNER}',
        1,
        '${wallets[2]}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'test1@gemunion.io',
        'qwerty',
        'Trej Gun',
        '${imageUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{MANAGER}',
        1,
        '0x01',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'test2@gemunion.io',
        'qwerty',
        'Trej Gun',
        '${imageUrl}',
        'EN',
        'US',
        'MALE',
        '',
        'ACTIVE',
        '{CUSTOMER}',
        1,
        '0x02',
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

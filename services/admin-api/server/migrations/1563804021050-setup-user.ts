import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";
import { imageUrl } from "@gemunion/framework-mocks";

export class SetupUser1563804021050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.user (
        email,
        password,
        first_name,
        last_name,
        phone_number,
        image_url,
        language,
        comment,
        user_status,
        user_roles,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        'trejgun@gmail.com',
        '92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff',
        'Trej',
        'Admin',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'EN',
        '',
        'ACTIVE',
        '{ADMIN,MERCHANT}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+merchant1@gmail.com',
        '92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff',
        'Trej',
        'Merchant 1',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'EN',
        '',
        'ACTIVE',
        '{MERCHANT}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+merchant2@gmail.com',
        '92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff',
        'Trej',
        'Merchant 2',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'EN',
        '',
        'ACTIVE',
        '{MERCHANT}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+customer1@gmail.com',
        '92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff',
        'Trej',
        'Customer 1',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'EN',
        '',
        'ACTIVE',
        '{CUSTOMER}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'trejgun+customer2@gmail.com',
        '92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff',
        'Trej',
        'Customer 2',
        '+62 (812) 3919-8760',
        '${imageUrl}',
        'EN',
        '',
        'INACTIVE',
        '{CUSTOMER}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.user RESTART IDENTITY CASCADE;`);
  }
}

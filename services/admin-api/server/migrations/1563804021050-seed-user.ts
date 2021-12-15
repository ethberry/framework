import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants";
import { imageUrl } from "@gemunion/framework-mocks";

export class SeedUser1563804021050 implements MigrationInterface {
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
        '97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe',
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
        '97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe',
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
        '97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe',
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
        '97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe',
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
        '97a609f782839fa886c8ae797d8d66f4a5138c2b02fb0dcab39ff74b85bc35fe',
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

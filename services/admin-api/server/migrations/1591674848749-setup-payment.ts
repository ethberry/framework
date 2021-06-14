import {MigrationInterface, QueryRunner} from "typeorm";
import {ns} from "@trejgun/solo-constants-misc";

export class SetupPayments1591674848749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.payment (
        user_id,
        amount,
        currency,
        source,
        receipt,
        created_at,
        updated_at
      ) VALUES (
        1,
        1,
        'UAH',
        'LIQPAY',
        '00001',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        10,
        'UAH',
        'LIQPAY',
        '00002',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        100,
        'UAH',
        'LIQPAY',
        '00003',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1000,
        'UAH',
        'LIQPAY',
        '00004',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        10000,
        'UAH',
        'LIQPAY',
        '00005',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        'UAH',
        'LIQPAY',
        '00006',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        10,
        'UAH',
        'LIQPAY',
        '00007',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        100,
        'UAH',
        'LIQPAY',
        '00008',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1000,
        'UAH',
        'LIQPAY',
        '00009',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        10000,
        'UAH',
        'LIQPAY',
        '00010',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        'UAH',
        'LIQPAY',
        '00011',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        10,
        'UAH',
        'LIQPAY',
        '00012',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        100,
        'UAH',
        'LIQPAY',
        '00013',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1000,
        'UAH',
        'LIQPAY',
        '00014',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        10000,
        'UAH',
        'LIQPAY',
        '00015',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.payment RESTART IDENTITY CASCADE;`);
  }
}

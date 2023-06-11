import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedTemplateErc1155At1563804000250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        150101
      ), (
        150102
      ), (
        150103
      ), (
        150104
      ), (
        150105
      ), (
        150401
      ), (
        150402
      ), (
        150403
      ), (
        250101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.template (
        id,
        title,
        description,
        image_url,
        price_id,
        cap,
        amount,
        template_status,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        150101,
        'Gold',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgold.png?alt=media&token=f5cc1a57-e948-45e0-8e2e-080270b9acb9',
        150101,
        0,
        '${WeiPerEther.toString()}',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150102,
        'Wood',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwood.png?alt=media&token=893edded-ee2a-4424-93c0-58600c988d16',
        150102,
        0,
        '${WeiPerEther.toString()}',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150103,
        'Iron ore',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Firon.png?alt=media&token=7c8d1921-addf-43d9-9deb-adc39ac252f0',
        150103,
        0,
        '${WeiPerEther.toString()}',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150104,
        'Planks',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fplank.png?alt=media&token=f468f387-4122-4724-9e8c-b57b3f5aa8cd',
        150104,
        0,
       '0',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150105,
        'Iron ingot',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Firon_ingot.png?alt=media&token=b1f42bb8-dac9-470b-bafd-787c03dc63d2',
        150104,
        0,
        '0',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150401,
        'Healing potion',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fpotion_health.png?alt=media&token=5b352eb5-96b4-4633-a838-2c0c6950c3c0',
        150401,
        0,
        '0',
        'ACTIVE',
        1504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150402,
        'Mana potion',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fpotion_mana.png?alt=media&token=67393fb6-cd28-4785-bf45-9c3a8003e7ba',
        150402,
        0,
        '0',
        'ACTIVE',
        1504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150403,
        'Antidote',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fpotion_antidot.png?alt=media&token=50411a77-e334-48c1-af85-cb004f7ee2e0',
        150403,
        0,
        '0',
        'ACTIVE',
        1504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        250101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        250101,
        0,
        '0',
        'ACTIVE',
        2501,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}

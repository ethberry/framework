import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { wallet, NodeEnv } from "@ethberry/constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imagePath, ns, testChainId } from "@framework/constants";

export class SeedContractLegacyVestingAt1563804000190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        LEGACY_VESTING_ADDR: Wallet.createRandom().address.toLowerCase(),
        LEGACY_VESTING_GRADED_ADDR: Wallet.createRandom().address.toLowerCase(),
        LEGACY_VESTING_CLIFF_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const vestingAddress = process.env.LEGACY_VESTING_ADDR;
    const vestingGradedAddress = process.env.LEGACY_VESTING_GRADED_ADDR;
    const vestingCliffAddress = process.env.LEGACY_VESTING_CLIFF_ADDR;
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;
    const vestingImgUrl = `${imagePath}/hourglass.png`;

    await queryRunner.query(`
      INSERT INTO ${ns}.contract (
        id,
        address,
        chain_id,
        title,
        description,
        image_url,
        name,
        symbol,
        base_token_uri,
        parameters,
        contract_status,
        contract_features,
        contract_module,
        contract_security,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        11301,
        '${vestingAddress}',
        '${chainId}',
        'VESTING #1',
        '${simpleFormatting}',
        '${vestingImgUrl}',
        'Vesting',
        '',
        '',
        '${JSON.stringify({
          account: wallet,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 417,
        })}',
        'ACTIVE',
        '{}',
        'LEGACY_VESTING',
        'OWNABLE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11302,
        '${vestingGradedAddress}',
        '${chainId}',
        'VESTING #2',
        '${simpleFormatting}',
        '${vestingImgUrl}',
        'Vesting',
        '',
        '',
        '${JSON.stringify({
          account: wallet,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 417,
        })}',
        'ACTIVE',
        '{}',
        'LEGACY_VESTING',
        'OWNABLE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11303,
        '${vestingCliffAddress}',
        '${chainId}',
        'VESTING #3',
        '${simpleFormatting}',
        '${vestingImgUrl}',
        'Vesting',
        '',
        '',
        '${JSON.stringify({
          account: wallet,
          startTimestamp: currentDateTime,
          cliffInMonth: 12,
          monthlyRelease: 417,
        })}',
        'ACTIVE',
        '{VOTES}',
        'LEGACY_VESTING',
        'OWNABLE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedContractVestingAt1563804000190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    populate(
      process.env as any,
      {
        VESTING_ADDR: Wallet.createRandom().address.toLowerCase(),
        VESTING_GRADED_ADDR: Wallet.createRandom().address.toLowerCase(),
        VESTING_CLIFF_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const vestingAddress = process.env.VESTING_ADDR;
    const vestingGradedAddress = process.env.VESTING_GRADED_ADDR;
    const vestingCliffAddress = process.env.VESTING_CLIFF_ADDR;
    const chainId = process.env.CHAIN_ID_BESU || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;

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
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        11301,
        '${vestingAddress}',
        '${chainId}',
        'VESTING #1',
        '${simpleFormatting}',
        '',
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
        'VESTING',
        'OWNABLE',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11302,
        '${vestingGradedAddress}',
        '${chainId}',
        'VESTING #2',
        '${simpleFormatting}',
        '',
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
        'VESTING',
        'OWNABLE',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11303,
        '${vestingCliffAddress}',
        '${chainId}',
        'VESTING #3',
        '${simpleFormatting}',
        '',
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
        'VESTING',
        'OWNABLE',
        '${fromBlock}',
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

import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedPyramidRules1660436477150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        insert into ${ns}.pyramid_rules(title, description, duration, penalty, recurrent, deposit_id, reward_id,
                                        external_id, staking_status, created_at, updated_at)
        select staking_rules.title,
               staking_rules.description,
               staking_rules.duration,
               staking_rules.penalty,
               staking_rules.recurrent,
               staking_rules.deposit_id,
               staking_rules.reward_id,
               staking_rules.external_id,
               'NEW' as staking_status,
               staking_rules.created_at,
               staking_rules.updated_at
        from ${ns}.staking_rules staking_rules
                 left join ${ns}.asset asset_deposit on asset_deposit.id = staking_rules.deposit_id
                 left join ${ns}.asset_component asset_component_deposit
                           on asset_deposit.id = asset_component_deposit.asset_id
                 left join ${ns}.contract contract_deposit on asset_component_deposit.contract_id = contract_deposit.id
                 left join ${ns}.asset asset_reward on asset_reward.id = staking_rules.reward_id
                 left join ${ns}.asset_component asset_component_reward
                           on asset_reward.id = asset_component_reward.asset_id
                 left join ${ns}.contract contract_reward on asset_component_reward.contract_id = contract_reward.id
        where (contract_deposit.contract_type = 'NATIVE' OR contract_deposit.contract_type = 'ERC20')
          AND (contract_reward.contract_type = 'NATIVE' OR contract_reward.contract_type = 'ERC20')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.pyramid_rule RESTART IDENTITY CASCADE;`);
  }
}

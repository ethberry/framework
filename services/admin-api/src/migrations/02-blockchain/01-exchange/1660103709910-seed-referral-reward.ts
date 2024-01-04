// TODO create Assets
// TODO create History
// export class SeedReferralRewardAt1660103709910 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<any> {
//     if (process.env.NODE_ENV === NodeEnv.production) {
//       return;
//     }
//
//     // const currentDateTime = new Date().toISOString();
//     // const now = new Date();
//     // await queryRunner.query(`
//     //   INSERT INTO ${ns}.referral_reward (
//     //     account,
//     //     referrer,
//     //     level,
//     //     price_id,
//     //     contract_id,
//     //     history_id,
//     //     created_at,
//     //     updated_at
//     //   ) VALUES (
//     //     '${wallets[0]}',
//     //     '${wallets[1]}',
//     //     0,
//     //     '${WeiPerEther.toString()}',
//     //     '${subDays(now, 1).toISOString()}',
//     //     '${currentDateTime}'
//     //   ), (
//     //     '${wallets[0]}',
//     //     '${wallets[1]}',
//     //     0,
//     //     '${WeiPerEther.toString()}',
//     //     '${subDays(now, 1).toISOString()}',
//     //     '${currentDateTime}'
//     //   ), (
//     //     '${wallets[0]}',
//     //     '${wallets[2]}',
//     //     0,
//     //     '${WeiPerEther.toString()}',
//     //     '${subDays(now, 2).toISOString()}',
//     //     '${currentDateTime}'
//     //   ), (
//     //     '${wallets[0]}',
//     //     '${wallets[2]}',
//     //     0,
//     //     '${WeiPerEther.toString()}',
//     //     '${subDays(now, 2).toISOString()}',
//     //     '${currentDateTime}'
//     //   ), (
//     //     '${wallets[0]}',
//     //     '${wallets[2]}',
//     //     1,
//     //     '${(WeiPerEther / 10n).toString()}',
//     //     '${subDays(now, 3).toISOString()}',
//     //     '${currentDateTime}'
//     //   ), (
//     //     '${wallets[1]}',
//     //     '${wallets[2]}',
//     //     0,
//     //     '${WeiPerEther.toString()}',
//     //     '${subDays(now, 3).toISOString()}',
//     //     '${currentDateTime}'
//     //   ), (
//     //     '${wallets[0]}',
//     //     '${wallets[2]}',
//     //     1,
//     //     '${(WeiPerEther / 10n).toString()}',
//     //     '${subDays(now, 4).toISOString()}',
//     //     '${currentDateTime}'
//     //   ), (
//     //     '${wallets[1]}',
//     //     '${wallets[2]}',
//     //     0,
//     //     '${WeiPerEther.toString()}',
//     //     '${subDays(now, 4).toISOString()}',
//     //     '${currentDateTime}'
//     //   );
//     // `);
//   }
//
//   public async down(queryRunner: QueryRunner): Promise<any> {
//     await queryRunner.query(`TRUNCATE TABLE ${ns}.referral_reward RESTART IDENTITY CASCADE;`);
//   }
// }

import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc20ClaimAt1563804040330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        parent_id,
        created_at,
        updated_at
      ) VALUES (
        1202010,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "120201",
          items: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202011,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202020,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "120202",
          items: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202021,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202030,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "120203",
          items: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202031,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202030,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202040,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "120204",
          items: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202041,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202040,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202050,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "120205",
          items: [
            [1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()],
            [1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202051,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202050,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202052,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202050,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202060,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "120206",
          items: [
            [1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()],
            [1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202061,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202060,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202062,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202060,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202070,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "120207",
          items: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202071,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202070,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202080,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "120208",
          items: [
            [1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()],
            [1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202081,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202080,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202082,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202080,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202090,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "120209",
          items: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202091,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202090,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202100,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "120210",
          items: [
            [1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()],
            [1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202101,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1202102,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1202100,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1755247037272 implements MigrationInterface {
  name = 'Migrations1755247037272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mail_service"."mail_requests" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `CREATE TYPE "mail_service"."mail_requests_status_enum" AS ENUM('NEW', 'PROCESSING', 'DONE', 'ERROR')`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_service"."mail_requests" ADD "status" "mail_service"."mail_requests_status_enum" NOT NULL DEFAULT 'NEW'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mail_service"."mail_requests" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "mail_service"."mail_requests_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_service"."mail_requests" ADD "status" character varying(128) NOT NULL DEFAULT 'New'`,
    );
  }
}

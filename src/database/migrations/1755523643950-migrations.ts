import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1755523643950 implements MigrationInterface {
    name = 'Migrations1755523643950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "mail_service"."mail_requests_status_enum" AS ENUM('NEW', 'QUEUED', 'PROCESSING', 'DONE', 'ERROR')`);
        await queryRunner.query(`CREATE TABLE "mail_service"."mail_requests" ("createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payload" jsonb NOT NULL, "external_id" character varying(255), "error_code" character varying(64), "retry_count" integer NOT NULL DEFAULT '0', "status" "mail_service"."mail_requests_status_enum" NOT NULL DEFAULT 'NEW', CONSTRAINT "PK_f64022cf5e6b01631958631d214" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mail_service"."mail_requests"`);
        await queryRunner.query(`DROP TYPE "mail_service"."mail_requests_status_enum"`);
    }

}

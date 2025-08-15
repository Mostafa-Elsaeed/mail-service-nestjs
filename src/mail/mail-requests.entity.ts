import { BaseEntity } from '../database/base-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mail_requests')
export class MailRequestsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  payload: unknown;

  @Column({ name: 'external_id', type: 'varchar', length: 255, nullable: true })
  externalId?: string;

  @Column({ name: 'error_code', type: 'varchar', length: 64, nullable: true })
  errorCode?: string;

  @Column({ name: 'retry_count', type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'varchar', length: 128, default: 'New' })
  status: 'New' | 'Processing' | 'Processed' | 'Error';
}

// @Entity({ name: 'external_events_raw', schema: '1_staging_external_events' })
// export class EventPayloads {

//   @CreateDateColumn({ name: 'captured_on', type: 'timestamp' })
//   capturedOn: Date;

//   @Column({ name: 'provider_name', type: 'varchar', length: 255 })
//   providerName: string;

//   @Column({ name: 'event_type_name', type: 'varchar', length: 255 })
//   eventTypeName: string;

//   @Column({ name: 'last_status_change', type: 'timestamp', nullable: true })
//   lastStatusChange?: Date;

//   @Column({ name: 'last_retried_on', type: 'timestamp', nullable: true })
//   lastRetriedOn?: Date;

// }

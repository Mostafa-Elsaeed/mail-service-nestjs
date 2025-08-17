import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
// import { MailAgentModule } from 'src/mail-agent/mail-agent.module';
import { MailConsumerService } from './mail-consumer.service';
import { ConfigModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailRequestsEntity } from './entities/mail-requests.entity';
import { SimulationModule } from '../simulation/simulation.module';
// import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
// import { MailConsumerService } from './mail-consumer.service';
// import { ConfigModule } from 'src/config/config.module';
// import { MailConsumerService } from './mail-consumer.service';

@Module({
  imports: [
    SimulationModule,
    ConfigModule,
    TypeOrmModule.forFeature([MailRequestsEntity]),
  ],
  controllers: [MailController],
  providers: [MailService, MailConsumerService],
})
export class MailModule {}

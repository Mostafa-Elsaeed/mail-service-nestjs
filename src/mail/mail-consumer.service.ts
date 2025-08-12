// import { Injectable } from '@nestjs/common';
// import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
// import { rabbitMqConfig } from 'src/config/sections/rabbit-mq/rabbit-mq.config';

// @Injectable()
// export class MailConsumerService {
//   constructor() {
//     console.log('✅ MailConsumerService initialized');
//   }

//   @EventPattern('another_mail_queue')
//   async handleUploadedFile(@Payload() data: any, @Ctx() context: RmqContext) {
//     console.log('📩 Received message from another_mail_queue:', data);
//     // await this.fileService.consumingFileData(data, context);
//   }
// }

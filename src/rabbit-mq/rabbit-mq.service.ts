import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { rabbitmqClientConfig } from './rabbit-mq-options';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class RabbitMQService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(rabbitmqClientConfig);
  }

  storeRequest(pattern: string, data: any) {
    return this.client.emit(pattern, data);
    // this.client.e
  }

  async publish(data: unknown): Promise<void> {
    await firstValueFrom(
      this.client.emit('another_mail_queue', data).pipe(
        catchError((exception: Error) => {
          return throwError(() => new Error(exception.message));
        }),
      ),
    );
  }
}

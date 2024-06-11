import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AxiosRetryModule } from 'nestjs-axios-retry';
import axiosRetry from 'axios-retry';

@Module({
  imports: [
    AxiosRetryModule.forRoot({
      axiosRetryConfig: {
        retries: 5,
        retryDelay: axiosRetry.exponentialDelay,
        shouldResetTimeout: true,
        retryCondition: (error) => error.response.status === 429,
        onRetry: (retryCount, _error, _requestConfig) => {
          console.log(`Retrying request attempt ${retryCount}`);
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

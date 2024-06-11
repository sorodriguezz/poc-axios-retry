import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ResilienceFactory, UseResilience } from 'nestjs-resilience';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  @UseResilience(
    ResilienceFactory.createFallbackStrategy(() => ({
      error: 'Error al obtener datos',
      status: false,
    })),
  )
  async fetchData() {
    const response = await firstValueFrom(
      this.httpService.get('https://example.com/data', {
        'axios-retry': {
          retries: 3,
          retryCondition: (error) => error?.response?.status != 200,
        },
      }),
    );

    return response.data;
  }
}

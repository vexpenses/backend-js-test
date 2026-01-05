import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BankingService } from './banking.service';

@Module({
  imports: [HttpModule],
  providers: [
    BankingService,
    {
      provide: 'BANKING_SERVICE',
      useClass: BankingService,
    },
  ],
  exports: ['BANKING_SERVICE', BankingService],
})
export class BankingModule {}


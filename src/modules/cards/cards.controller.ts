import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { RegisterCardDto } from './dto/register-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users/:userId/card')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    @Inject('BANKING_SERVICE') private bankingService: any,
  ) {}

  @Get()
  async show(@Param('userId') userId: string, @CurrentUser() user: any) {
    const cards = await this.cardsService.findByUser(userId);
    return {
      success: true,
      method: 'GET',
      code: 200,
      data: cards,
    };
  }

  @Post('register')
  async register(
    @Param('userId') userId: string,
    @Body() dto: RegisterCardDto,
    @CurrentUser() user: any,
  ) {
    const result = await this.cardsService.register(
      userId,
      dto,
      this.bankingService,
    );
    return {
      success: true,
      method: 'POST',
      code: 200,
      data: result,
    };
  }
}


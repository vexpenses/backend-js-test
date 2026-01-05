import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { RegisterAccountDto } from './dto/register-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users/:userId')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    @Inject('BANKING_SERVICE') private bankingService: any,
  ) {}

  @Get('account')
  async show(@Param('userId') userId: string) {
    const account = await this.accountsService.findByUser(userId);
    return {
      success: true,
      method: 'GET',
      code: 200,
      data: account,
    };
  }

  @Post('account/register')
  async register(
    @Param('userId') userId: string,
    @Body() dto: RegisterAccountDto,
    @CurrentUser() user: any,
  ) {
    const result = await this.accountsService.register(
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

  @Put('account/active')
  async activate(@Param('userId') userId: string) {
    const result = await this.accountsService.activateAccount(
      userId,
      this.bankingService,
    );
    return {
      success: true,
      method: 'PUT',
      code: 200,
      data: result,
    };
  }

  @Put('account/block')
  async block(@Param('userId') userId: string) {
    const result = await this.accountsService.blockAccount(
      userId,
      this.bankingService,
    );
    return {
      success: true,
      method: 'PUT',
      code: 200,
      data: result,
    };
  }
}


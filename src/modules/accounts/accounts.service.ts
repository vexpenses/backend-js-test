import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountStatus } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { RegisterAccountDto } from './dto/register-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['account'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.account) {
      throw new NotFoundException('Account not found');
    }

    return user.account;
  }

  async register(userId: string, dto: RegisterAccountDto, bankingService: any) {
    console.log('Registering account for user:', userId);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['account'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.account) {
      throw new BadRequestException('User already has an account');
    }

    // Check if external account_id is already in use
    const existingAccount = await this.accountRepository.findOne({
      where: { external_id: dto.account_id },
    });

    if (existingAccount) {
      throw new BadRequestException('Account ID already in use');
    }

    // Call banking service to register
    const bankingResponse = await bankingService.registerAccount(dto.account_id, dto.pin);

    // Create account
    const account = this.accountRepository.create({
      user_id: userId,
      external_id: dto.account_id,
      status: AccountStatus.ACTIVE,
    });

    await this.accountRepository.save(account);

    return {
      account,
      banking_data: bankingResponse,
    };
  }

  async activateAccount(userId: string, bankingService: any) {
    const account = await this.findByUser(userId);

    if (account.status === AccountStatus.ACTIVE) {
      throw new BadRequestException('Account is already active');
    }

    // Call banking service to activate
    await bankingService.activateAccount(account.external_id);

    account.status = AccountStatus.ACTIVE;
    await this.accountRepository.save(account);

    return account;
  }

  async blockAccount(userId: string, bankingService: any) {
    const account = await this.findByUser(userId);

    if (account.status === AccountStatus.BLOCK) {
      throw new BadRequestException('Account is already blocked');
    }

    // Call banking service to block
    await bankingService.blockAccount(account.external_id);

    account.status = AccountStatus.BLOCK;
    await this.accountRepository.save(account);

    return account;
  }
}


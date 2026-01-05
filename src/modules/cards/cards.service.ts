import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card, CardStatus } from '../../database/entities/card.entity';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { RegisterCardDto } from './dto/register-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['account', 'account.cards'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.account) {
      throw new NotFoundException('Account not found');
    }

    return user.account.cards || [];
  }

  async register(userId: string, dto: RegisterCardDto, bankingService: any) {
    console.log('Registering card for user:', userId, dto);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['account'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.account) {
      throw new NotFoundException('Account not found for this user');
    }

    const existingCard = await this.cardRepository.findOne({
      where: { external_id: dto.card_id },
    });

    if (existingCard != null) {
      throw new BadRequestException('Card ID already in use');
    }

    // Call banking service to register card
    const bankingResponse = await bankingService.registerCard(
      user.account.external_id,
      dto.card_id,
      dto.pin,
    );

    // Create card
    const card = this.cardRepository.create({
      account_id: user.account.id,
      external_id: dto.card_id,
      status: CardStatus.ACTIVE,
    });

    await this.cardRepository.save(card);

    return {
      card,
      banking_data: bankingResponse,
    };
  }
}


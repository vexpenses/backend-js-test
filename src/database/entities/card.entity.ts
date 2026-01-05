import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';

export enum CardStatus {
  BLOCK = 'BLOCK',
  ACTIVE = 'ACTIVE',
}

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  account_id: string;

  @Column({ type: 'uuid', nullable: true })
  external_id: string;

  @Column({
    type: 'enum',
    enum: CardStatus,
  })
  status: CardStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Account, (account) => account.cards)
  @JoinColumn({ name: 'account_id' })
  account: Account;
}


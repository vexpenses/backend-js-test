import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Card } from './card.entity';

export enum AccountStatus {
  BLOCK = 'BLOCK',
  ACTIVE = 'ACTIVE',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  external_id: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
  })
  status: AccountStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.account)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[];
}


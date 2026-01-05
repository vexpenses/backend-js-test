import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BasicStrategy } from './strategies/basic.strategy';
import { User } from '../../database/entities/user.entity';
import { authConfig } from '../../config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: authConfig.jwtSecret,
      signOptions: { expiresIn: authConfig.jwtExpiration + 's' },
    }),
  ],
  providers: [AuthService, JwtStrategy, BasicStrategy],
  exports: [AuthService],
})
export class AuthModule {}


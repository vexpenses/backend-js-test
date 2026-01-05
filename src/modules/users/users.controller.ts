import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { RegisterUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserType } from '../../database/entities/user.entity';
import { Company } from '../../database/entities/company.entity';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const result = await this.usersService.register(dto);
    return {
      success: true,
      method: 'POST',
      code: 200,
      data: result,
    };
  }

  @Post('login')
  @UseGuards(BasicAuthGuard)
  async login(@CurrentUser() user: any) {
    const result = await this.usersService.login(user.id);
    return {
      success: true,
      method: 'POST',
      code: 200,
      data: result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: any,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('status') status?: string,
  ) {
    const users = await this.usersService.findAll(
      user.company_id,
      name,
      email,
      status,
    );
    return {
      success: true,
      method: 'GET',
      code: 200,
      data: users,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const result = await this.usersService.findOne(id, user?.company_id);
    return {
      success: true,
      method: 'GET',
      code: 200,
      data: result,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateUserDto, @CurrentUser() user: any) {
    console.log('Creating user in controller:', dto);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (dto.document_number.length < 11) {
      throw new BadRequestException('Document number must have at least 11 characters');
    }

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUserByEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingUserByDocument = await this.userRepository.findOne({
      where: { document_number: dto.document_number },
    });

    if (existingUserByDocument) {
      throw new BadRequestException('User with this document already exists');
    }

    const company = await this.companyRepository.findOne({
      where: { id: user.company_id },
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }

    if (dto.type === UserType.MANAGER) {
      const managerCount = await this.userRepository.count({
        where: { company_id: user.company_id, type: UserType.MANAGER },
      });

      if (managerCount >= 5) {
        throw new BadRequestException('Company cannot have more than 5 managers');
      }
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      document_number: dto.document_number,
      password: hashedPassword,
      type: dto.type,
      company_id: user.company_id,
    });

    await this.userRepository.save(newUser);

    console.log('User created successfully:', newUser.id);

    const responseData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      type: newUser.type,
      document_number: newUser.document_number,
      company_id: newUser.company_id,
      created_at: newUser.created_at,
    };

    return {
      success: true,
      method: 'POST',
      code: 200,
      message: 'User created successfully',
      data: responseData,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    const result = await this.usersService.update(id, dto, user.company_id);
    return {
      success: true,
      method: 'PATCH',
      code: 200,
      data: result,
    };
  }
}


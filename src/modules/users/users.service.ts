import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserType } from '../../database/entities/user.entity';
import { Company } from '../../database/entities/company.entity';
import { RegisterUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private authService: AuthService,
  ) {}

  async register(dto: RegisterUserDto) {
    console.log('Registering new user:', dto);

    // Check if company document already exists
    const existingCompany = await this.companyRepository.findOne({
      where: { document_number: dto.company_document_number },
    });

    if (existingCompany) {
      throw new BadRequestException('Company document number already exists');
    }

    // Check if user email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Create company
    const company = this.companyRepository.create({
      name: dto.company_name,
      document_number: dto.company_document_number,
    });
    await this.companyRepository.save(company);

    // Create user as MANAGER
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      name: dto.user_name,
      document_number: dto.user_document_number,
      email: dto.email,
      password: hashedPassword,
      type: UserType.MANAGER,
      company_id: company.id,
    });
    await this.userRepository.save(user);

    const token = await this.authService.generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        company_id: user.company_id,
      },
      token,
    };
  }

  async login(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.authService.generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        company_id: user.company_id,
        password: user.password,
      },
      token,
    };
  }

  async findAll(companyId: string, name?: string, email?: string, status?: string) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.company_id = :companyId', { companyId });

    if (name) {
      query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }

    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    // Note: status filter not properly implemented
    const users = await query.getMany();

    return users;
  }

  async findOne(id: string, companyId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['company', 'account'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto, companyId: string) {
    console.log('Creating user:', dto);

    const existingUser = await this.userRepository.findOne({
      where: [
        { email: dto.email },
        { document_number: dto.document_number },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or document already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
      company_id: companyId,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      document_number: user.document_number,
      company_id: user.company_id,
    };
  }

  async update(id: string, dto: UpdateUserDto, companyId: string) {
    const user = await this.userRepository.findOne({
      where: { id, company_id: companyId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      document_number: user.document_number,
    };
  }
}


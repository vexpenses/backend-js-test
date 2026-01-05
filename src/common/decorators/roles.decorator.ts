import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../database/entities/user.entity';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);


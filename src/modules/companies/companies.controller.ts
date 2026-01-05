import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async show(@CurrentUser() user: any) {
    const company = await this.companiesService.findOne(user.company_id);
    return {
      success: true,
      method: 'GET',
      code: 200,
      data: company,
    };
  }

  @Patch()
  async update(@Body() dto: UpdateCompanyDto, @CurrentUser() user: any) {
    const company = await this.companiesService.update(user.company_id, dto);
    return {
      success: true,
      method: 'PATCH',
      code: 200,
      data: company,
    };
  }
}


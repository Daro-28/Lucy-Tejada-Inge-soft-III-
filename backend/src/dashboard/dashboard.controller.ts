import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Rol } from '../entities/enums';
import { Usuario } from '../entities/usuario.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Rol.ADMIN)
  @Get('admin')
  admin() {
    return this.dashboardService.getAdminDashboard();
  }

  @Roles(Rol.EDUCADOR)
  @Get('profesor')
  profesor(@CurrentUser() user: Usuario) {
    return this.dashboardService.getProfesorDashboard(user.id);
  }

  @Roles(Rol.ESTUDIANTE)
  @Get('estudiante')
  estudiante(@CurrentUser() user: Usuario) {
    return this.dashboardService.getEstudianteDashboard(user.id);
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Rol } from '../../entities/enums';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'juan@lucytejada.edu.co' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'contraseña123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Rol, example: Rol.ESTUDIANTE })
  @IsEnum(Rol)
  rol: Rol;

  @ApiPropertyOptional({ example: '2024-001', description: 'Solo para ESTUDIANTE' })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiPropertyOptional({ example: 'Música', description: 'Solo para EDUCADOR' })
  @IsOptional()
  @IsString()
  especialidad?: string;
}
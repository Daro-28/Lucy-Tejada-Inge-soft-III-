import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Rol } from '../../entities/enums';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(Rol)
  rol: Rol;

  // Solo para ESTUDIANTE
  @IsOptional()
  @IsString()
  codigo?: string;

  // Solo para EDUCADOR
  @IsOptional()
  @IsString()
  especialidad?: string;
}
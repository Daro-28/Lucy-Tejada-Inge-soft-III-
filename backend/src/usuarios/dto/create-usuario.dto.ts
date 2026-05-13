import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsString,
    MinLength,
} from 'class-validator';
import { Rol } from '../../entities/enums';

export class CreateUsuarioDto {
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

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}
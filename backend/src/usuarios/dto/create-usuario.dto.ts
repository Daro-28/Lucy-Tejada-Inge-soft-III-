import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Rol } from '../../entities/enums';

export class CreateUsuarioDto {
    @ApiProperty({ example: 'María García' })
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @ApiProperty({ example: 'maria@lucytejada.edu.co' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'contraseña123', minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: Rol, example: Rol.ESTUDIANTE })
    @IsEnum(Rol)
    rol: Rol;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}
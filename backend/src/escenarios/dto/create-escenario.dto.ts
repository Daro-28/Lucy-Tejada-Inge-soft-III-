import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { EstadoEscenario } from '../../entities/enums';

export class CreateEscenarioDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsInt()
    @Min(1)
    capacidad: number;

    @IsOptional()
    @IsEnum(EstadoEscenario)
    estado?: EstadoEscenario;
}
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { EstadoMatricula } from '../../entities/enums';

export class CreateMatriculaDto {
    @IsUUID()
    estudianteId: string;

    @IsUUID()
    grupoId: string;

    @IsOptional()
    @IsEnum(EstadoMatricula)
    estado?: EstadoMatricula;
}
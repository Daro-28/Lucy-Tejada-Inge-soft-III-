import { IsEnum } from 'class-validator';
import { EstadoMatricula } from '../../entities/enums';

export class UpdateMatriculaDto {
    @IsEnum(EstadoMatricula)
    estado: EstadoMatricula;
}
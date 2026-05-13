import { IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateAsistenciaDto {
    @IsUUID()
    estudianteId: string;

    @IsUUID()
    grupoId: string;

    @IsDateString()
    fecha: string;

    @IsOptional()
    @IsBoolean()
    presente?: boolean;
}
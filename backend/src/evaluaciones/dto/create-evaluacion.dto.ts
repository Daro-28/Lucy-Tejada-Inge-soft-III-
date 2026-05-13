import { IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateEvaluacionDto {
    @IsUUID()
    estudianteId: string;

    @IsUUID()
    grupoId: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    calificacion?: number;
}
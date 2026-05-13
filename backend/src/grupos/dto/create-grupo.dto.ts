import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateGrupoDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    horario?: string;

    @IsInt()
    @Min(1)
    cupoMaximo: number;

    @IsOptional()
    @IsUUID()
    educadorId?: string;

    @IsOptional()
    @IsUUID()
    programaId?: string;
}
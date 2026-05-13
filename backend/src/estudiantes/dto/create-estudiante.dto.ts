import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEstudianteDto {
    @IsUUID()
    usuarioId: string;

    @IsOptional()
    @IsString()
    codigo?: string;
}
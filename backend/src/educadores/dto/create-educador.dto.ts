import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEducadorDto {
    @IsUUID()
    usuarioId: string;

    @IsOptional()
    @IsString()
    especialidad?: string;
}
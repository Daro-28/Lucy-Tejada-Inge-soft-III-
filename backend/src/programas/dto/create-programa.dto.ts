import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProgramaDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;
}
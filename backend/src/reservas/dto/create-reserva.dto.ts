import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReservaDto {
    @IsUUID()
    usuarioId: string;

    @IsUUID()
    escenarioId: string;

    @IsDateString()
    fecha: string;

    @IsNotEmpty()
    horaInicio: string;

    @IsNotEmpty()
    horaFin: string;
}
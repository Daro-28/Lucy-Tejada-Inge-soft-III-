import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNotificacionDto {
    @IsUUID()
    usuarioId: string;

    @IsNotEmpty()
    @IsString()
    mensaje: string;
}
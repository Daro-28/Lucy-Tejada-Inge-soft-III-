import { IsBoolean } from 'class-validator';

export class UpdateAsistenciaDto {
    @IsBoolean()
    presente: boolean;
}
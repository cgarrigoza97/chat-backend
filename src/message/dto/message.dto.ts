import { IsNotEmpty } from "class-validator";

export class MessageDTO {
    @IsNotEmpty()
    from: string;

    @IsNotEmpty()
    to: string;

    @IsNotEmpty()
    message: string;
}
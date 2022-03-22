import {IsEmail, IsNotEmpty} from 'class-validator';

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}
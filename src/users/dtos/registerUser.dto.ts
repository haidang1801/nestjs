import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    firstName: string;


    @IsNotEmpty()
    password: string;
}
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @IsString()
    @IsNotEmpty({ message: 'username or email not provided' })
    public username_or_email: string;

    @IsString()
    @IsNotEmpty({ message: 'password not provided' })
    public password: string;
}
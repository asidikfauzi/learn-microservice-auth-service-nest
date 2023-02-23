import {IsEmail, IsNotEmpty, IsNumber, IsString} from '@nestjs/class-validator'

export class RegisterDTO {
    @IsString()
    @IsNotEmpty({ message: 'username not provided'})
    public username: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: 'email not provided' })
    public email: string;

    @IsString()
    @IsNotEmpty({ message: 'password not provided'})
    public password: string;

    @IsNumber()
    @IsNotEmpty({ message: 'role id not provided' })
    public role_id: number;
}
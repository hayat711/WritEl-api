import { IsEmail, IsNotEmpty, NotContains, Length } from 'class-validator'

export class LoginDto {

    @IsNotEmpty({
        message: 'Email cannot be empty or whitespace'
    })
    @IsEmail({}, {
        message: 'Email should be email'
    })
    email: string


    @IsNotEmpty({
        message: 'Password cannot be empty or whitespace'
    })
    @NotContains(' ', {
        message: 'Password cannot be empty or whitespace'
    })
    @Length(6, 100, {
        message: 'Password must be between 6 and 100 characters long'
    })
    password: string
}
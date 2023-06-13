import {IsEmail, IsNotEmpty, IsString, Length, Matches, NotContains} from "class-validator";

export class CreateAccountDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @NotContains(' ', {
        message: 'Password cannot be empty or whitespace'
    })
    @Length(6, 100)
    password: string;

    @IsNotEmpty()
    @Length(2, 30)
    firstName: string

    @IsNotEmpty()
    @Length(2, 30)
    lastName: string

    @IsNotEmpty()
    @Length(2, 30)
    @Matches(/^[\w](?!.*?\.{2})[\w. ]{1,30}[\w]$/, {
        message: "Display name can include only letters, numbers and space between words and be max 30 characters long"
    })
    displayName: string

}
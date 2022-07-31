import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class AddDashboardDTO {
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name: string
}
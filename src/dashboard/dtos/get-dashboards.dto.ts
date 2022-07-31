import { IsBoolean, IsBooleanString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, Max, Min } from "class-validator"

export class GetDashboardsDTO {
    @IsNotEmpty()
    @IsNumberString()

    take: number

    @IsBooleanString()
    @IsOptional()
    populateTrafficLights?: string
}
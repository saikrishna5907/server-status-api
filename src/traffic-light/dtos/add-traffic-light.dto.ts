import { IsIn, IsNotEmpty, IsNumber } from "class-validator";

export class AddTrafficLightDTO {
    @IsNumber()
    @IsIn([1, 0])
    @IsNotEmpty()
    status: number;

    @IsNotEmpty()
    dashboardId: number;
}
import { IsNotEmpty } from "class-validator";
import { UniqueEmail } from "./uniqueValidation";

export default class RegisterUserRequest {
  @IsNotEmpty()
  name: string = "";

  @UniqueEmail()
  @IsNotEmpty()
  email: string = "";

  @IsNotEmpty()
  password: string = "";
}

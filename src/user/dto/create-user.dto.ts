import {
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object) // Needed for nested validation
  locations?: {
    city: string;
    country: string;
  };
}

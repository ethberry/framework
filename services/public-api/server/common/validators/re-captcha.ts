import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import {firstValueFrom} from "rxjs";
import {map} from "rxjs/operators";

interface IReCaptchaResponse {
  success: boolean;
  "error-codes": Array<string>;
}

interface IReCaptchaConstraints {
  required: boolean;
}

@Injectable()
@ValidatorConstraint({async: true})
export class ValidateReCaptcha implements ValidatorConstraintInterface {
  private reason: string;

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

  public async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    this.reason = await this.isValid(value, args);
    return !this.reason;
  }

  public defaultMessage(): string {
    return this.reason;
  }

  private async isValid(value: unknown, args: ValidationArguments): Promise<string> {
    const {required = true}: IReCaptchaConstraints = args.constraints[0];

    if (process.env.NODE_ENV === "test") {
      return "";
    }

    if (!required) {
      return "";
    }

    const response = this.httpService
      .request({
        url: "https://www.google.com/recaptcha/api/siteverify",
        method: "POST",
        params: {
          secret: this.configService.get<string>("GOOGLE_RECAPTCHA_PRIVATE"),
          response: value,
        },
      })
      .pipe(map((response: {data: IReCaptchaResponse}) => response.data));

    return firstValueFrom(response).then(data => {
      if (!data.success) {
        return `recaptcha-${data["error-codes"][0]}`.replace(/-./g, (x: string) => x.toUpperCase()[1]);
      }
      return "";
    });
  }
}

export function ReCaptcha(constraints: Partial<IReCaptchaConstraints> = {}, validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: "ReCaptcha",
      target: object.constructor,
      propertyName,
      constraints: [constraints],
      options: validationOptions,
      validator: ValidateReCaptcha,
    });
  };
}

import { CanActivate, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtSystemGuard extends AuthGuard("jwt-system") implements CanActivate {}

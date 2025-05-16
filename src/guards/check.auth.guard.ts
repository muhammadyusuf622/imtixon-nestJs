import { BadRequestException, CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { PROTECTED_KEY } from "../decaratores/protected.decorator";
import { UserRole } from "src/modules";
import { JwtHelper } from "src/helpers";



@Injectable()
export class CheckAuthGuard implements CanActivate{

  constructor(private readonly reflector: Reflector, private readonly jwt: JwtHelper) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const request = ctx.getRequest< Request & {role?: UserRole, userId: string}>();

    if (!isProtected) {
      request.role = UserRole.USER;
      return true;
    }

    const token = request.headers['authorization']

    if (!token || !token.startsWith('Bearer')) {
      throw new BadRequestException('Iltimos Bearer token yuboring');
    }

    const accessToken = token.split('Bearer')[1].trim();

    if (!accessToken) {
      throw new BadRequestException('Access token berib yuboring');
    }
      
      const data = await this.jwt.verifyToken(accessToken)
      request.userId = data?.id;
      request.role = data?.role

      return true

  }
}
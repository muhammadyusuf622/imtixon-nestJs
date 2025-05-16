import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decaratores";
import { UserRole } from "src/modules";


@Injectable()
export class CheckRoleGuard implements CanActivate{
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    
    const ctx = context.switchToHttp();
    const request = ctx.getRequest< Request & {role?: UserRole, userId: string}>();

    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY ,[
      context.getHandler(),
      context.getClass(),
    ]);

    let userRole:any = request.role
    if(!roles || !roles.includes( userRole )){
      throw new ForbiddenException('Siz bu amalni bajara olmaysiz');
    }

    return true
  }
}
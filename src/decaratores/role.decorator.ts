import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/modules";


export const ROLES_KEY = 'ROLES';

export const Roles = (roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
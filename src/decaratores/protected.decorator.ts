import { SetMetadata } from "@nestjs/common";


export const PROTECTED_KEY = 'PROTECTED';

export const Protected = (isProtected: boolean) => SetMetadata(PROTECTED_KEY, isProtected)
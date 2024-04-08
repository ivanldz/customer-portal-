import { applyDecorators, UseGuards } from '@nestjs/common';
import { Permissions } from './permission.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

export function Auth(permission: string) {
  return applyDecorators(
    Permissions(permission),
    UseGuards(AuthGuard, PermissionsGuard),
  );
}

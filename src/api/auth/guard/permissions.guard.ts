import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthDbService } from '@db/auth/auth-db.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private authDbService: AuthDbService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. What permission does this route need?
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    if (!requiredPermission) return true;

    // 2. Who is the user? (Assumes JwtAuthGuard has already run)
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    if (!userId) throw new ForbiddenException('User not authenticated or missing ID');

    // 3. The "Hybrid" Check
    // We try to find the user ONLY if they have the permission in Path A OR Path B
    const hasAccess = await this.authDbService.checkPermission(userId, requiredPermission);

    if (!hasAccess) {
      throw new ForbiddenException(`Missing permission: ${requiredPermission}`);
    }

    return true;
  }
}
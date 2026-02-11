// src/api/auth/guard/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DBService } from '@db/db.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private db: DBService) {}

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
    const hasAccess = await this.db.users.findFirst({
      where: {
        id: userId,
        OR: [
          {
            // Path A: Check if any of the user's roles have this permission
            user_roles: {
              some: {
                role: {
                  role_permissions: {
                    some: { permission: { permission_name: requiredPermission } }
                  }
                }
              }
            }
          },
          {
            // Path B: Check if the user has this permission directly (The Override)
            user_permissions: {
              some: {
                permission: { permission_name: requiredPermission }
              }
            }
          }
        ]
      },
      select: { id: true } // We only care if a record is returned
    });

    if (!hasAccess) {
      throw new ForbiddenException(`Missing permission: ${requiredPermission}`);
    }

    return true;
  }
}
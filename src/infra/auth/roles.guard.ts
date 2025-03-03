import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserPayload } from './jwt.strategy'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Pegar a lista de selos permitidos (ex: ['admin'])
    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    )

    // Se não tem lista, todo mundo passa!
    if (!allowedRoles) return true

    // Pega o selo do usuário (admin? courier?)
    const user = context.switchToHttp().getRequest().user as UserPayload

    // SELO INVÁLIDO? BLOQUEAR!
    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedException('Você não tem acesso! 🚷')
    }

    return true // SELO VÁLIDO! 🎟️
  }
}

import { SetMetadata } from '@nestjs/common'

// Decorator mágico que define quem pode entrar!
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)

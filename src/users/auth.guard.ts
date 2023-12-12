import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from './auth.config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    //Token "daskfjsalkfjds";
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    if (type !== 'Token' || !token) return undefined;
    return token;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConfig.secret,
      });
      request.user = payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
    return true;
  }
}

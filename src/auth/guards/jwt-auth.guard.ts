import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      
      if (!authHeader) {
        throw new UnauthorizedException('No authorization header found. Please provide a Bearer token.');
      }
      
      if (!authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Invalid authorization header format. Expected: "Bearer <token>"');
      }
      
      if (info) {
        if (info.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token has expired. Please login again.');
        }
        if (info.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid token. Please check your token.');
        }
        throw new UnauthorizedException(`Authentication failed: ${info.message || 'Unknown error'}`);
      }
      
      throw err || new UnauthorizedException('Authentication failed');
    }
    return user;
  }
}


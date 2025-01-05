import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // const request = context.switchToHttp().getRequest();
    try {
      // const tokenRequest = request.headers.cookie.split(';').find((cookies) => {
      //   return cookies.trim().startsWith('auth.usr=');
      // });

      // const tokenParts = tokenRequest.split('=');
      // const token = tokenParts[1];
      // cambiar
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1aXNsdW5hMzM4QGdtYWlsLmNvbSIsIm5hbWUiOiJMdWlzIEx1bmEiLCJyb2xlIjoic3RhbmRhcmQgdXNlciIsImRldGFpbHMiOnt9LCJyZXB1dGF0aW9uUG9pbnRzIjowLCJ1c2VybmFtZSI6Ikx1Y2hvS2VhIiwiaWQiOiI2NzMzZTIxYTdmNzc5OWE2MGJiYzVmNzMiLCJpYXQiOjE3MzE0NTM0ODksImV4cCI6MTczMTQ1NzA4OX0.zYFP6gpDEf1-qYsgtsg1z3aEAzP4qyC_3JRj13AiqsI';
      // JWTHelper.parseCreztuJWT(token);

      console.log('token => ', token);
      return next.handle();
    } catch (error) {
      console.error('Error transforming token => ', error);
      return next.handle();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class GitHubApiVersionInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('https://api.github.com/')) {
      const clone = req.clone({
        setHeaders: { Accept: 'application/vnd.github.v3.star+json' }
      });
      return next.handle(clone);
    }

    return next.handle(req);
  }
}

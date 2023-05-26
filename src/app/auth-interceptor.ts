import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { AuthenticationService } from "./authentication.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    let cookie = AuthInterceptor.getCookie('csrftoken');
    if(cookie) {
      req = req.clone({
        headers: req.headers.set('X-CSRFToken', cookie)
      });
    }

    if (this.authService.loginToken) {
      try {
        const token: any = jwt_decode(this.authService.loginToken.access);
        if(token.exp > new Date().getTime() / 1000) {
          req = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + this.authService.loginToken.access)
          });
        }
      }
      catch (e) {
        console.error(e);
      }
    }
    return next.handle(req);
  }

  public static getCookie(name: string): string | null {
    let cookieValue: string | null = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
}

import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, retryWhen, tap } from 'rxjs/operators';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { genericRetryStrategy } from "./util";
import { ErrorHandlingService } from "./error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly JWT_COOKIE_NAME = 'JWTToken';

  loggedIn$ = new ReplaySubject<boolean>(1);
  $jwtToken = new ReplaySubject<LoginToken | undefined>(1);

  _loginToken: LoginToken | undefined;

  constructor(private http: HttpClient, private errorHandling: ErrorHandlingService) {}

  private getCookie(name: string) {
    return document.cookie.split(';').map(val => val.trim()).find(c => {
      return c.startsWith(name + '=');
    })
      ?.substring(name.length + 1);
  }

  private delete_cookie( name: string ) {
    if( this.getCookie( name ) ) {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }

  checkLoginStatus(): Observable<unknown> {
    let stringToken = this.getCookie(this.JWT_COOKIE_NAME);
    if(!stringToken) {
      stringToken = localStorage.getItem(this.JWT_COOKIE_NAME) || undefined;
    }
    if(!stringToken) {
      this.loginToken = undefined;
    }
    else {
      try {
        const token = jwt_decode<JwtPayload>(stringToken);
        if(token.exp && token.exp > new Date().getTime() / 1000) {
          return this.refreshToken(stringToken)
        }
        else {
          this.logout();
        }
      }
      catch (e) {
        this.logout();
      }
    }
    return of();
  }

  login$(username: string, password: string): Observable<LoginResult> {
    return this.http.post<LoginToken>('/rest/api/token/', {username, password}).pipe(
      tap((data) => this.loginSuccessful(data)),
      map(() => {return {success: true}}),
      catchError((message) => of(AuthenticationService.createLoginResultFromFailure(message.error)))
    )
  }

  private loginSuccessful(token : LoginToken) {
    this.loginToken = token;
    this.loggedIn$.next(true);
  }

  private static createLoginResultFromFailure(error: LoginError): LoginResult {
    return {success: false, errorMessage: error.detail}
  }

  private static createRegisterResultFromFailure(error: LoginError): LoginResult {
    return {success: false, errorMessage: error.detail}
  }

  logout() {
    this.loginToken = undefined;
    this.loggedIn$.next(false);
    this.deleteToken();
  }

  refreshToken(savedToken?: string): Observable<LoginToken> {
    let token: string;
    if(savedToken) {
      token = savedToken;
    }
    else if(this.loginToken) {
      token = this.loginToken.refresh;
    }
    else {
      throw new Error("Tried to refresh without being signed in and no token provided")
    }
    return this.http.post<{access: string}>('/rest/api/token/refresh/', {"refresh": token}).pipe(
      retryWhen(genericRetryStrategy({
        excludedStatusCodes: (status) => status > 400 && status < 500
      })),
      tap(() => {}, () => this.errorHandling.$hasMajorError.next(true)),
      map((accessToken) => {
        return {
          access: accessToken.access,
          refresh: token
        };
      }),
      tap((loginToken) => this.loginToken = loginToken)
    )
  }

  registerUser(email: string, password: string): Observable<LoginResult> {
    return this.http.post<LoginToken>('/rest/users/', {username: email, email, password}).pipe(
      tap((data) => this.loginSuccessful(data)),
      map(() => {return {success: true}}),
      catchError((message) => of(AuthenticationService.createRegisterResultFromFailure(message.error)))
    )
  }

  get loginToken(): LoginToken | undefined {
    return this._loginToken;
  }

  set loginToken(token: LoginToken | undefined) {
    this._loginToken = token;
    if(token) {
      this.$jwtToken.next(token);
    }
    else {
      this.$jwtToken.next(undefined);
    }
  }

  requestPasswordReset(email: string) {
    return this.http.post('rest/api/password_reset/', {email});
  }

  setPassword(token: string, password: string) {
    return this.http.post('rest/api/password_reset/confirm/', {token, password});
  }

  saveToken(jwtToken: LoginToken): Observable<any> {
    localStorage.setItem(this.JWT_COOKIE_NAME, jwtToken.refresh);
    const token = jwt_decode<JwtPayload>(jwtToken.refresh);
    const d = new Date(0);
    d.setUTCSeconds(token.exp!)
    return this.http.post('rest/api/set-cookie/', {name: this.JWT_COOKIE_NAME, value: jwtToken.refresh, expiration: d.toISOString()});
  }

  deleteToken() {
    this.delete_cookie(this.JWT_COOKIE_NAME);
    localStorage.removeItem(this.JWT_COOKIE_NAME);
  }
}

interface LoginToken {
  access: string;
  refresh: string;
}

export interface LoginResult {
  success: boolean;
  errorMessage?: string;
}

interface LoginError {
  detail: string;
}

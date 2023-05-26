import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SecureHttp {

    constructor(private http: HttpClient, private authenticationService: AuthenticationService, private router: Router) {}

    get<T>(url: string, params?: HttpParams): Observable<T> {
        return this.http.get<T>(url, {params}).pipe(
            tap(() => {}, (error: HttpErrorResponse) => this.handleHttpError(error))
        );
    }

    post<T>(url: string, data: any): Observable<T> {
        return this.http.post<T>(url, data).pipe(
            tap(() => {}, (error: HttpErrorResponse) => this.handleHttpError(error))
        );
    }

    put<T>(url: string, data: any): Observable<T> {
        return this.http.put<T>(url, data).pipe(
            tap(() => {}, (error: HttpErrorResponse) => this.handleHttpError(error))
        );
    }

    patch<T>(url: string, data: any): Observable<T> {
        return this.http.patch<T>(url, data).pipe(
            tap(() => {}, (error: HttpErrorResponse) => this.handleHttpError(error))
        );
    }

    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(url).pipe(
            tap(() => {}, (error: HttpErrorResponse) => this.handleHttpError(error))
        );
    }

    private handleHttpError(error: HttpErrorResponse) {
        if(error.status === 401) {
            this.authenticationService.logout();
            this.router.navigate(['login'])
        }
    }
}

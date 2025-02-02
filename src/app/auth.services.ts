import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Backend URL
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken()); // Initialize state based on token in localStorage

  loggedIn$ = this.loggedInSubject.asObservable(); // Observable to expose login state for the UI

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  login(username: string, password: string): Observable<any> {
    localStorage.setItem('username', username);
    return this.http
      .post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token); // Store the token
            localStorage.setItem('username', username); // Store the username
            this.loggedInSubject.next(true); // Notify observers that the user is logged in
          };
          return response;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.loggedInSubject.next(false); // Notify observers that the user is logged out
  }
 
  


  isLoggedIn(): boolean {
    return !localStorage.getItem('authToken'); // Check if token exists
  }

  hasToken(): boolean {
    return !localStorage.getItem('authToken') ; // Check if token exists (for initial state)
  }

  getUsername(): string | null {
    return localStorage.getItem('username'); // Retrieve username from localStorage
  }
}

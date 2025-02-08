import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://spotifyclone4backend.vercel.app'; // Use HTTP for local development
 // Backend URL
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken()); // Initialize state based on token in localStorage

  loggedIn$ = this.loggedInSubject.asObservable(); // Observable to expose login state for the UI
  authService: any;

  constructor(private http: HttpClient) {}
  ngOnInit() {
    // Subscribe to the logged-in state
    this.authService.loggedIn$.subscribe((isLoggedIn: () => boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }


  login(username: string, password: string): Observable<any> {
    localStorage.setItem('username', username);  // Store username
  
    return this.http.post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((response: any) => {
          if (response && response.userId && response.token) {
            localStorage.setItem('userId', response.userId);  // Store userId
            localStorage.setItem('authToken', response.token); // Store auth token
            localStorage.setItem('isLoggedIn', 'true');  // Set login status to true
  
            // Notify observers that the user is logged in
            this.loggedInSubject.next(true);
          }
          return response;
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId'); 
    localStorage.clear();// Assuming userId is stored on login
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
  getUserId(): string | null {
    return localStorage.getItem('userId');  // Assuming userId is stored on login
  }
  
}


import { Component } from '@angular/core';
import { AuthService } from '../auth.services'; // Update the path if needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  confirmPassword: string = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
            this.error = 'Passwords do not match';
            return;
          }
    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.success = 'Registration successful! Please log in.';
        this.error = '';
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (err) => {
        this.error = err.error.message || 'An error occurred. Please try again.';
        this.success = '';
      }
    });
  }
}

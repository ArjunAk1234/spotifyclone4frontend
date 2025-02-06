
// import { Component } from '@angular/core';
// import { AuthService } from '../auth.services';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username = '';
//   password = '';
//   error = '';

//   constructor(private auth: AuthService, private router: Router) {}

//   onSubmit() {
//     this.auth.login(this.username, this.password).subscribe({
//       next: () => {
//         console.log('Login successful!');
//         this.router.navigate(['/home']).then(() => {
//           // alert(localStorage.getItem('isLoggedIn'));
//           localStorage.setItem('isLoggedIn', 'true');  // Set the logged-in status in local storage for persistence
       
//           window.location.reload();  // This will force a full page reload
//         });// Navigate to the home page
//       },
//       error: (err) => {
//         console.error('Error:', err);
//         this.error = err.status === 401 ? 'Invalid username or password' : 'An error occurred. Please try again later.';
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { AuthService } from '../auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Login successful!');

        // After successful login, navigate to the home page
        this.router.navigate(['/home']).then(() => {
          window.location.reload();  // Force reload to update the UI
        });
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = err.status === 401 ? 'Invalid username or password' : 'An error occurred. Please try again later.';
      }
    });
  }
}

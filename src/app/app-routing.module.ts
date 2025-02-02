// // import { NgModule } from '@angular/core';
// // import { RouterModule, Routes } from '@angular/router';
// // import { LoginComponent } from './login/login.component';

// // const routes: Routes = [
// //   {
// //     path: '',
// //     component: LoginComponent,
// //   },
// // ];

// // @NgModule({
// //   imports: [RouterModule.forRoot(routes)],
// //   exports: [RouterModule],
// // })
// // export class AppRoutingModule {}

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { HomeComponent } from './home/home.component';
// import { AuthGuard } from './auth.guard';

// const routes: Routes = [
//     { path: 'login', component: LoginComponent },
//     { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
//     { path: '', redirectTo: '/login', pathMatch: 'full' }
// ];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
// })
// export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';  // Import the AuthGuard
import { SignupComponent } from './signup/signup.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent,runGuardsAndResolvers: 'always' },  // Protect home route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

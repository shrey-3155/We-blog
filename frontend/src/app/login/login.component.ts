import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment.development';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

@Injectable({
  providedIn: 'root'
})
export class LoginComponent {
  loginForm:FormGroup;
  loginResponse:any=[];
  endpoint: string = environment.apiUrl;
  isAuthenticat: boolean= false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      userID: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  SignupRedirect(){
    this.router.navigate(['/signup']);
  }

  isAuthenticated(){
    if(localStorage.getItem("UserId")){
      this.isAuthenticat = true;
    }
    return this.isAuthenticat;
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.value;

    this.http.post(this.endpoint + '/loginFunction', loginData).subscribe({
      next: (response: any) => {
        this.loginResponse = response;
        const responseBody = JSON.parse(this.loginResponse.body);
    
        if (this.loginResponse.statusCode === 200) {
          console.log('Login successful', responseBody.userID);
          localStorage.setItem('UserId', responseBody.userID);
    
          // Show success alert
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: `Welcome, ${responseBody.userID}!`,
            confirmButtonText: 'Continue'
          }).then(() => {
            // Navigate after the user dismisses the alert
            this.router.navigate(['/landingpage']);
          });
        } else {
          // Show error alert for unsuccessful login
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Please check your credentials and try again.',
            confirmButtonText: 'Try Again'
          });
        }
      },
      error: (error) => {
        console.error('Login failed', error);
    
        // Show error alert for network or server issues
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: 'An error occurred while trying to log in. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}

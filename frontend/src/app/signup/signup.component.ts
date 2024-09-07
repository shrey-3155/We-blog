import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm:FormGroup;
  endpoint: string = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    
  }
  SignupRedirect(){
    this.router.navigate(['/login']);
  }
  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const signupData = this.signupForm.value;
    this.http.post(this.endpoint + '/signupFunction', signupData).subscribe({
      next: (response: any) => {
        const singupRes = JSON.parse(response.body);
        if (response.statusCode === 200) {
          console.log('Sign up successful', response);
    
          // Show success alert
          Swal.fire({
            icon: 'success',
            title: 'Signup Successful',
            text: 'Your account has been created successfully!',
            confirmButtonText: 'Go to Login'
          }).then(() => {
            // Navigate to login page after the user dismisses the alert
            this.router.navigate(['/login']);
          });
        } else {
          // Show error alert for unsuccessful signup
          Swal.fire({
            icon: 'error',
            title: 'Signup Failed',
            text: singupRes.message ,
            confirmButtonText: 'Try Again'
          });
        }
      },
      error: (error) => {
        console.error('Sign up failed', error);
    
        // Show error alert for network or server issues
        Swal.fire({
          icon: 'error',
          title: 'Signup Error',
          text: 'An error occurred while trying to sign up. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    });
    
  }
}

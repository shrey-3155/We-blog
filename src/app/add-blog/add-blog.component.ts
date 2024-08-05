import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.css'
})
export class AddBlogComponent {
  addBlogForm: FormGroup;
  imageError: string | null = null;
  pdfError: string | null = null;
  endpoint: string = environment.apiUrl;
  constructor(private fb: FormBuilder, 
    private http: HttpClient, 
    private router:Router) {
    this.addBlogForm = this.fb.group({
      UserID: localStorage.getItem("UserId"),
      Title: ['', Validators.required],
      Content: ['', Validators.required],
      ImageBase64: [''],
      PDFBase64: ['']
    });
  }

  ngOnInit(): void {
    this.addBlogForm.value.userID = localStorage.getItem('userID');
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the prefix before storing the base64 data
        const base64String = (reader.result as string).replace(/^data:image\/[a-z]+;base64,/, '');
        this.addBlogForm.patchValue({ ImageBase64: base64String });
        this.imageError = null;
      };
      reader.onerror = () => {
        this.imageError = 'Could not read the image file.';
      };
      reader.readAsDataURL(file);
    }
  }
  

  onPDFSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the prefix before storing the base64 data
        const base64String = (reader.result as string).replace(/^data:application\/pdf;base64,/, '');
        this.addBlogForm.patchValue({ PDFBase64: base64String });
        this.pdfError = null;
      };
      reader.onerror = () => {
        this.pdfError = 'Could not read the PDF file.';
      };
      reader.readAsDataURL(file);
    }
  }
  

  onSubmit(): void {
    if (this.addBlogForm.valid) {
      const blogData = this.addBlogForm.value;
      console.log(this.addBlogForm.value.ImageBase64);
      
      this.http.post(this.endpoint + '/AddBlogFunction', blogData).subscribe({
        next: (response) => {
          console.log('Blog added successfully', response);
          // Show success message
          Swal.fire({
            title: 'Success!',
            text: 'Blog added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Optional: Reset the form or redirect after showing the message
            this.addBlogForm.reset();
            this.router.navigate(['/landingpage']); // Redirect to the blog list page
          });
        },
        error: (error) => {
          console.error('Failed to add blog', error);
          // Show error message
          Swal.fire({
            title: 'Error!',
            text: 'Failed to add blog. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }
}

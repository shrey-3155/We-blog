import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.css'
})
export class EditBlogComponent implements OnInit {

  postID:number = 0;
  editBlog: FormGroup;
  imageError: string | null = null;
  pdfError: string | null = null;
  endpoint: string = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient, 

  ){
    this.editBlog = this.fb.group({
      PostID:'',
      UserID: localStorage.getItem("UserId"),
      Title: ['', Validators.required],
      Content: ['', Validators.required],
      ImageBase64: [''],
      PDFBase64: ['']
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.postID = params['postID'];
      this.editBlog.patchValue({
        PostID: this.postID
      });
    });
    this.getBlogDetails(this.postID);
    
  }

  getBlogDetails(postId: number) {
    const url = this.endpoint + '/getIdWiseBlogFunction';
    const requestBody = { postId: postId }; // Sending postId in the body
  
    this.http.post<any>(url, requestBody).subscribe(
      (response) => {
        const responseBody = JSON.parse(response.body);
  
        this.editBlog.patchValue({
          PostID: responseBody.postID,
          UserID: responseBody.userID,
          Title: responseBody.title,
          Content: responseBody.content,
          ImageBase64: responseBody.imageURL,
          PDFBase64: responseBody.PDFURL,
          sentiment: responseBody.sentiment
        });
  
        console.log(this.editBlog.value);
      },
      (error) => {
        console.error('Error fetching blog details:', error);
      }
    );
  }
  
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the prefix before storing the base64 data
        const base64String = (reader.result as string).replace(/^data:image\/[a-z]+;base64,/, '');
        this.editBlog.patchValue({ ImageBase64: base64String });
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
        this.editBlog.patchValue({ PDFBase64: base64String });
        this.pdfError = null;
      };
      reader.onerror = () => {
        this.pdfError = 'Could not read the PDF file.';
      };
      reader.readAsDataURL(file);
    }
  }
  onSubmit() {
    if (this.editBlog.invalid) {
      return;
    }

    const url = this.endpoint + `/updateBlogFunction`; // Update with your actual API endpoint
    this.http.post<any>(url, this.editBlog.value).subscribe(
      (response) => {
        Swal.fire('Success', 'Blog updated successfully', 'success').then(() => {
          this.router.navigate(['/landingpage']); // Navigate to another page after success
        });
      },
      (error) => {
        Swal.fire('Error', 'Error updating blog', 'error');
        console.error('Error updating blog:', error);
      }
    );
  }
}

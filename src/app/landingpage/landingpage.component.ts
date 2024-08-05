import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment.development';

// interface BlogPost {
//   PostID: string;
//   UserID: string;
//   Title: string;
//   Content: string;
//   ImageURL: string;
//   PDFURL: string;
// }

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent {
  blogs: any = [];
  userID: string | null = null;
  endpoint: string = environment.apiUrl;

  constructor(private http: HttpClient,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.userID = localStorage.getItem('UserId');
    this.getAllBlogs();
  }

  fetchBlogs(): void {
    // Fetch blogs for the current user
    this.http.post<any>(this.endpoint + `/fetchBlogsFunction`, { userID: this.userID }).subscribe({
      next: (data) => {
        this.blogs = data; // Assuming the response is already in JSON format
      },
      error: (error) => {
        console.error('Failed to fetch blogs', error);
      }
    });
  }

  deleteBlog(postID: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the post with ID: ${postID}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(this.endpoint + `/deleteBlogFunction`, { postId: postID }).subscribe(
          () => {
            Swal.fire(
              'Deleted!',
              'Your blog post has been deleted.',
              'success'
            );
            this.ngOnInit();
            // Optionally, you can remove the deleted post from your view
            // this.removePostFromView(postID);
          },
          (error) => {
            console.error('Error deleting post:', error);
            Swal.fire(
              'Error!',
              'There was an error deleting your post. Please try again later.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your blog post is safe :)',
          'info'
        );
      }
    });
  }

  getMyBlogs(){
    this.fetchBlogs();
  }

  getAllBlogs() {
    this.http.post<any>(this.endpoint + `/getAllBlogsFunction`, {}).subscribe({
      next: (data) => {
        this.blogs = JSON.parse(data.body); // Assuming the response is already in JSON format
      },
      error: (error) => {
        console.error('Failed to fetch blogs', error);
      }
    });
  }
  // editBlog(postID:Number){
  //   this.router.navigate(['editblog']);
  // }
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  openAddBlogModal(): void {
    this.router.navigate(['/addblogs']);
  }
}

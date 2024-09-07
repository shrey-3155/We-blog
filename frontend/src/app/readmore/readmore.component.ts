import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-readmore',
  templateUrl: './readmore.component.html',
  styleUrl: './readmore.component.css'
})
export class ReadmoreComponent {
  blog: any; // Define the type based on your data structure
  endpoint: string = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http:HttpClient, private fb:FormBuilder) {
  
      
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const postID = params['postID'];
      this.getBlogDetails(postID)
    });;
  }
  getBlogDetails(postId: number) {
    const url = this.endpoint + '/getIdWiseBlogFunction';
    const body = { postId: postId };

    this.http.post<any>(url, body).subscribe(
        (response) => {
            this.blog = JSON.parse(response.body);
        },
        (error) => {
            console.error('Error fetching blog details:', error);
        }
    );
}

  
}

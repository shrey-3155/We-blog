import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { ReadmoreComponent } from './readmore/readmore.component';

const routes: Routes = [
  {path:'', redirectTo:'signup',pathMatch:'full'},
  {path:'landingpage',component:LandingpageComponent},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'addblogs',component:AddBlogComponent},
  {path:'editblog',component:EditBlogComponent},
  {path:'readmore',component:ReadmoreComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

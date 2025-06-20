import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { PostList } from './post/post-list/post-list';
import { PostDetail } from './post/post-detail/post-detail';

export const routes: Routes = [
    { path: '', component: PostList, pathMatch: 'full' },
    {path: 'posts/:id', component: PostDetail, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'register', component: RegisterComponent, pathMatch: 'full' },
];

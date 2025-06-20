import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoginMutation } from '../../../generated/graphql';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  successMessage = '';
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) { }
  
  onSubmit(form: any) {
    this.authService.login(this.username, this.password).subscribe(token=>{
    if (token){
      localStorage.setItem('token', token);
      console.log('Login successful, token saved:', token);
      alert('Login successful!');
      this.router.navigate(['/']); // Navigate to home or dashboard after login
    }
  });
    console.log('Form submitted:', form);
  }
}

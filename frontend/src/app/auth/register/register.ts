import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  successMessage = '';
  errorMessage = '';
  constructor(private authService: AuthService) { }
  onSubmit(form: any) {
    this.authService.register(this.username, this.password, this.email).subscribe(success => {
      if (success) {
        console.log('Registration successful');
        alert('Registration successful!');
        this.successMessage = 'Registration successful! You can now log in.';
      } else {
        console.error('Registration failed');
        alert('Registration failed. Please try again.');
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
    console.log('Form submitted:', form);
  }
}

import { Component } from '@angular/core';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterModule, RouterOutlet, MatToolbarModule],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {
  showLogo = true;

  ngOnInit(){
    setTimeout(() => {
      this.showLogo = false;
    }, 1000)
  }

}

import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Angular Starter';

  ROUTES = [
    {
      path: '/tracker',
      name: 'Tracker',
    },
  ];
}

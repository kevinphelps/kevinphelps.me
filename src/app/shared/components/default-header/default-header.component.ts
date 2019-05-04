import { Component } from '@angular/core';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html'
})
export class DefaultHeaderComponent {
  collapseMobileMenu = true;

  toggleMobileMenu() {
    this.collapseMobileMenu = !this.collapseMobileMenu;
  }
}

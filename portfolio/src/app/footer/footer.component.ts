import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <p>Copyright &copy; {{year}} - Ahmad Barutchi</p>
    </footer>
  `,
  styles: [`
    footer {
      background-color: #333;
      color: #fff;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}

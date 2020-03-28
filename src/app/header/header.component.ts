import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormControl, Validators} from '@angular/forms';
import {User} from 'firebase';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isMenuOpened = false;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  hide = true;

  constructor(public auth: AuthService, private router: Router) {
  }


  ngOnInit(): void {
  }

  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;

    if (this.isMenuOpened) {
      const menuPopover: HTMLElement = document.querySelector('.popover');
      const header: HTMLElement = document.querySelector('.header');
      const container: HTMLElement = document.querySelector('.container');

      menuPopover.style.right =
        `${header.getBoundingClientRect().width - (container.getBoundingClientRect().x + container.getBoundingClientRect().width)}px`;
    }

    const overlay = document.querySelector('.overlay');
    overlay.classList.toggle('hidden');
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  onNoClick(): void {
    this.toggleMenu();
  }

  login() {
    this.auth.login(this.email.value, this.password.value);
  }

}

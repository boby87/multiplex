import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuItem } from './menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import MetisMenu from 'metismenujs';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { SimplebarAngularModule } from 'simplebar-angular';
import { AuthService } from '../../core/service/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-sidebar',
  imports: [
    TranslatePipe,
    RouterLink,
    NgClass,
    RouterLinkActive,
    SimplebarAngularModule,
    NgTemplateOutlet,
    FontAwesomeModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef: any;
  @Input() isCondensed = false;
  private menu!: MetisMenu;
  menuItems: MenuItem[] = [];
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
    this.initialize();
    this._scrollElement();
  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  toggleMenu(event: any) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  ngOnChanges() {
    if ((!this.isCondensed && this.sideMenu) || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }

  _scrollElement() {
    setTimeout(() => {
      if (document.getElementsByClassName('mm-active').length > 0) {
        const currentPosition = (document.getElementsByClassName('mm-active')[0] as HTMLElement)
          .offsetTop;
        if (currentPosition > 500)
          if (this.scrollRef.SimpleBar !== null)
            this.scrollRef.SimpleBar.getScrollElement().scrollTop = currentPosition + 300;
      }
    }, 300);
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown(): void {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');

    const links = Array.from(
      document.getElementsByClassName('side-nav-link-ref')
    ) as HTMLAnchorElement[];
    const paths = links.map(link => link.pathname);
    const currentPath = window.location.pathname;

    let menuItemEl: HTMLAnchorElement | null = null;
    const exactIndex = paths.indexOf(currentPath);

    if (exactIndex !== -1) {
      menuItemEl = links[exactIndex];
    } else {
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
      const parentIndex = paths.indexOf(parentPath);
      if (parentIndex !== -1) {
        menuItemEl = links[parentIndex];
      }
    }

    if (menuItemEl) {
      menuItemEl.classList.add('active');
      this._activateParentElements(menuItemEl);
    }
  }

  /**
   * Recursively activate parent menu elements up to #side-menu
   */
  private _activateParentElements(element: HTMLElement): void {
    let currentEl: HTMLElement | null = element.parentElement;

    while (currentEl && currentEl.id !== 'side-menu') {
      currentEl.classList.add('mm-active');

      const ulEl = currentEl.querySelector('ul');
      if (ulEl) {
        ulEl.classList.add('mm-show');
      }

      const arrow = currentEl.querySelector('.has-arrow');
      if (arrow) {
        arrow.classList.add('mm-active');
      }

      const dropdown = currentEl.querySelector('.has-dropdown');
      if (dropdown) {
        dropdown.classList.add('mm-active');
      }

      const isParent = currentEl.querySelector('.is-parent');
      if (isParent) {
        isParent.classList.add('mm-active');
      }

      currentEl = currentEl.parentElement;
    }
  }

  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = this.authService.menus$;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.children ? item.children.length > 0 : false;
  }

  getIcon(key: string): string {
    return this.MENU_ICONS[key] ?? 'fa fa-circle'; // icône par défaut
  }
  private MENU_ICONS: Record<string, string> = {
    'menu::dashboard': 'fa fa-home',
    'menu::config': 'fa fa-cogs',
    'menu::uaa': 'fa fa-users-cog',
    'menu::uaa::acls': 'fa fa-key',
    'menu::uaa::roles': 'fa fa-user-shield',
    'menu::uaa::users': 'fa fa-user',
    'menu::organization': 'fa fa-building',
    'menu::organization::companies': 'fa fa-industry',
    'menu::organization::departments': 'fa fa-sitemap',
    'menu::organization::jobs': 'fa fa-briefcase',
    'menu::catalog': 'fa fa-boxes',
    'menu::catalog::productCategories': 'fa fa-tags',
    'menu::catalog::uoms': 'fa fa-ruler',
    'menu::catalog::baseProducts': 'fa fa-cube',
    'menu::catalog::productVariants': 'fa fa-cubes',
    'menu::prices': 'fa fa-dollar-sign',
    'menu::prices::pricesList': 'fa fa-list-alt',
    'menu::rh': 'fa fa-users',
    'menu::rh::employee': 'fa fa-id-badge',
    'menu::rh::technicians': 'fa fa-user-cog',
    'menu::crm': 'fa fa-address-book',
    'menu::crm::physical_technician': 'fa fa-user-cog',
    'menu::crm::business_technician': 'fa fa-briefcase',
  };
}

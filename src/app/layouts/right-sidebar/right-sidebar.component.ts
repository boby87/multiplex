import { Component, inject, OnInit } from '@angular/core';
import { EventService } from '../../core/service/event.service';
import { SimplebarAngularModule } from 'simplebar-angular';
import { layoutStore } from '../store/signalStore';

@Component({
  selector: 'app-right-sidebar',
  imports: [SimplebarAngularModule],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent implements OnInit {
  width!: string;
  mode!: string;
  topbar!: string;
  theme!: string;
  layoutSize!: string;
  sidebar!: string;
  private store = inject(layoutStore);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.mode = this.store.LAYOUT_MODE();
    this.theme = this.store.DATA_LAYOUT();
    this.topbar = this.store.TOPBAR_TYPE();
    this.sidebar = this.store.SIDEBAR_MODE();
    this.layoutSize = this.store.LAYOUT_WIDTH();
  }

  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove('right-bar-enabled');
  }

  changeWidth(layoutWidth: any) {
    this.store.changeLayoutWidth(layoutWidth);
    this.store.changeAll();
  }

  // sidebar
  changeSidebartype(sidebarMode: string) {
    this.store.changeSidebarMode(sidebarMode);
    this.store.changeAll();
  }

  changeMode(mode: string) {
    this.store.changeMode(mode);
    this.store.changeAll();
  }
}

// INIT_STATE
import {
  DATA_LAYOUT_MODE,
  LAYOUT_MODE_TYPES,
  LAYOUT_WIDTH_TYPES,
  LayoutState,
  SIDEBAR_TYPE,
  TOPBAR_MODE_TYPES,
} from './model';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

export const initialState: LayoutState = {
  LAYOUT_MODE: LAYOUT_MODE_TYPES.LIGHTMODE,
  DATA_LAYOUT: DATA_LAYOUT_MODE.VERTICAL,
  LAYOUT_WIDTH: LAYOUT_WIDTH_TYPES.FLUID,
  SIDEBAR_MODE: SIDEBAR_TYPE.COLOERED,
  TOPBAR_TYPE: TOPBAR_MODE_TYPES.COLORED,
};

export const layoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(store => ({
    changeAll: computed(() => {
      document.body.setAttribute('data-bs-theme', store.LAYOUT_MODE());
      document.body.setAttribute('data-layout-size', store.LAYOUT_WIDTH());
      document.body.setAttribute('data-sidebar', store.SIDEBAR_MODE());
      document.body.setAttribute('data-topbar', store.TOPBAR_TYPE());

      switch (store.SIDEBAR_MODE()) {
        case 'light':
          document.body.setAttribute('data-sidebar', 'light');
          document.body.setAttribute('data-topbar', 'light');
          document.body.removeAttribute('data-sidebar-size');
          document.body.removeAttribute('data-layout-size');
          document.body.removeAttribute('data-keep-enlarged');
          document.body.classList.remove('vertical-collpsed');
          document.body.removeAttribute('data-layout-scrollable');
          break;
        case 'compact':
          document.body.setAttribute('data-sidebar-size', 'small');
          document.body.setAttribute('data-sidebar', 'dark');
          document.body.removeAttribute('data-topbar');
          document.body.removeAttribute('data-layout-size');
          document.body.removeAttribute('data-keep-enlarged');
          document.body.classList.remove('sidebar-enable');
          document.body.classList.remove('vertical-collpsed');
          document.body.removeAttribute('data-layout-scrollable');
          break;
        case 'dark':
          document.body.setAttribute('data-sidebar', 'dark');
          document.body.removeAttribute('data-topbar');
          document.body.removeAttribute('data-layout-size');
          document.body.removeAttribute('data-keep-enlarged');
          document.body.removeAttribute('data-sidebar-size');
          document.body.classList.remove('sidebar-enable');
          document.body.classList.remove('vertical-collpsed');
          document.body.removeAttribute('data-layout-scrollable');
          break;
        case 'icon':
          document.body.classList.add('vertical-collpsed');
          document.body.setAttribute('data-sidebar', 'dark');
          document.body.removeAttribute('data-layout-size');
          document.body.setAttribute('data-keep-enlarged', 'true');
          document.body.removeAttribute('data-topbar');
          document.body.removeAttribute('data-layout-scrollable');
          break;
        case 'colored':
          document.body.classList.remove('sidebar-enable');
          document.body.classList.remove('vertical-collpsed');
          document.body.setAttribute('data-sidebar', 'colored');
          document.body.removeAttribute('data-layout-size');
          document.body.removeAttribute('data-keep-enlarged');
          document.body.removeAttribute('data-topbar');
          document.body.removeAttribute('data-layout-scrollable');
          document.body.removeAttribute('data-sidebar-size');
          break;
        default:
          document.body.setAttribute('data-sidebar', 'dark');
          break;
      }
      switch (store.LAYOUT_WIDTH()) {
        case 'fluid':
          document.body.setAttribute('data-layout-size', 'fluid');
          document.body.classList.remove('vertical-collpsed');
          document.body.removeAttribute('data-layout-scrollable');
          break;
        case 'boxed':
          document.body.setAttribute('data-layout-size', 'boxed');
          document.body.classList.add('vertical-collpsed');
          document.body.removeAttribute('data-layout-scrollable');
          break;
        case 'scrollable':
          document.body.removeAttribute('data-layout-size');
          document.body.setAttribute('data-layout-scrollable', 'true');
          document.body.setAttribute('data-layout-size', 'fluid');
          document.body.classList.remove('right-bar-enabled', 'vertical-collpsed');
          break;
        default:
          document.body.setAttribute('data-layout-size', 'fluid');
          break;
      }
    }),
  })),
  withMethods(store => ({
    changeMode(mode: string) {
      patchState(store, { ...store.LAYOUT_MODE, LAYOUT_MODE: mode });
      document.documentElement.setAttribute('data-topbar', store.LAYOUT_MODE());
      if (store.LAYOUT_MODE() == 'light') {
        document.documentElement.setAttribute('data-topbar', 'dark');
      } else {
        document.documentElement.setAttribute('data-topbar', store.LAYOUT_MODE());
      }
    },
    changeSidebarMode(sidebarMode: string) {
      patchState(store, { ...store.SIDEBAR_MODE, SIDEBAR_MODE: sidebarMode });
    },
    changeLayoutWidth(layoutWidth: string) {
      patchState(store, { ...store.LAYOUT_WIDTH, LAYOUT_WIDTH: layoutWidth });
      document.documentElement.setAttribute('data-layout-size', store.LAYOUT_WIDTH());
    },
    changesLayout(layoutMode: string) {
      patchState(store, { ...store.DATA_LAYOUT, DATA_LAYOUT: layoutMode });
    },
  }))
);

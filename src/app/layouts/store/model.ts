export interface LayoutState {
  LAYOUT_MODE: string;
  DATA_LAYOUT: string;
  LAYOUT_WIDTH: string;
  SIDEBAR_MODE: string;
  TOPBAR_TYPE: string;
}
export { LAYOUT_MODE_TYPES, DATA_LAYOUT_MODE, LAYOUT_WIDTH_TYPES, SIDEBAR_TYPE, TOPBAR_MODE_TYPES };

const LAYOUT_MODE_TYPES = {
  LIGHTMODE: 'light',
  DARKMODE: 'dark',
};

const DATA_LAYOUT_MODE = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

const LAYOUT_WIDTH_TYPES = {
  FLUID: 'fluid',
  BOXED: 'boxed',
  SCROLLABLE: 'scrollable',
};

const SIDEBAR_TYPE = {
  LIGHT: 'light',
  DARK: 'dark',
  COLOERED: 'colored',
};

const TOPBAR_MODE_TYPES = {
  LIGHT: 'light',
  DARK: 'dark',
  COLORED: 'colored',
};

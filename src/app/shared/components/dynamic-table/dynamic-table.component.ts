import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgClass, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

export interface TableActionButton {
  label: string;
  icon: string;
  doAction: (item: any) => void;
}

@Component({
  selector: 'app-dynamic-table',
  imports: [FormsModule, NgOptimizedImage, TranslatePipe, NgClass],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent {
  filteredData = input.required<any[]>();
  columns = input.required<any[]>();
  actions = input.required<TableActionButton[]>();
  withCheckBox = input<boolean>(false);

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = signal(1);
  pageSize = 10;

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredData().sort((a: any, b: any) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData().length / this.pageSize);
  }

  isImage(val: any): boolean {
    return typeof val === 'string' && val.match('http://') != null;
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  toggleAll() {
    const allSelected = this.areAllSelected();
    this.filteredData().forEach(item => (item.selected = !allSelected));
  }

  areAllSelected(): boolean {
    return this.filteredData().every(item => item.selected);
  }

  get visiblePages(): number[] {
    if (this.totalPages <= 2) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (this.currentPage() === 1) {
      pages.push(1, 2);
    } else if (this.currentPage() === this.totalPages) {
      pages.push(this.totalPages - 1, this.totalPages);
    } else {
      pages.push(this.currentPage(), this.currentPage() + 1);
    }

    return pages;
  }

  paginatedData = computed(() => {
    const data = this.filteredData();
    const start = (this.currentPage() - 1) * this.pageSize;
    return data.slice(start, start + this.pageSize);
  });

  getStatusClass(col: string | boolean): string {
    switch (col) {
      case 'Actif':
        return 'badge bg-success';
      case true:
        return 'badge bg-success';
      case 'New':
        return 'badge bg-info';
      case 'Close':
        return 'badge bg-danger';
      case false:
        return 'badge bg-danger';
      case 'Inactif':
        return 'badge bg-secondary';
      default:
        return '';
    }
  }

  getBadgeClass(permission: string): string {
    if (/create/.test(permission)) return 'badge bg-success';
    if (/read/.test(permission)) return 'badge bg-info';
    if (/edit|update/.test(permission)) return 'badge bg-warning text-dark';
    if (/delete/.test(permission)) return 'badge bg-danger';
    return 'badge bg-secondary';
  }

  isArraysOfString(itemElement: any): boolean {
    return Array.isArray(itemElement) && itemElement.every(el => typeof el === 'string');
  }
}

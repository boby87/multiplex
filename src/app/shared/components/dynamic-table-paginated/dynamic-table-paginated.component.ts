import { Component, computed, input, output } from '@angular/core';
import { PaginatedResponse } from '../../model/paginatedResponse';
import { TableActionButton } from '../dynamic-table/dynamic-table.component';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-table-paginated',
  imports: [FormsModule, NgOptimizedImage, TranslatePipe],
  templateUrl: './dynamic-table-paginated.component.html',
  styleUrl: './dynamic-table-paginated.component.scss',
})
export class DynamicTablePaginatedComponent {
  data = input.required<PaginatedResponse<any>>();
  columns = input.required<any[]>();
  actions = input.required<TableActionButton[]>();
  withCheckBox = input<boolean>(false);
  pageChange = output<number>();
  filteredData = computed(() => this.data().content);
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredData()?.sort((a: any, b: any) => {
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
      this.pageChange.emit(page); // API attend 0-based
    }
  }

  get currentPage(): number {
    return this.data()?.page != null ? this.data()!.page + 1 : 1;
  }

  get totalPages(): number {
    return this.data()?.totalPages ?? 0;
  }

  isImage(val: any): boolean {
    return typeof val === 'string' && val.match(/\.(jpeg|jpg|gif|png)$/) != null;
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
    if (this.currentPage === 1) {
      pages.push(1, 2);
    } else if (this.currentPage === this.totalPages) {
      pages.push(this.totalPages - 1, this.totalPages);
    } else {
      pages.push(this.currentPage, this.currentPage + 1);
    }

    return pages;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Actif':
        return 'badge bg-success';
      case 'New':
        return 'badge bg-info';
      case 'Close':
        return 'badge bg-danger';
      case 'Inactif':
        return 'badge bg-secondary';
      default:
        return '';
    }
  }
}

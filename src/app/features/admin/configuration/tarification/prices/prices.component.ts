import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { Price, ProductVariant } from '../../../../../shared/model/productCategory';
import { filterDataByTerm } from '../../../../../shared/utility/fonction';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';
import { SearchBoxComponent } from '../../../../../shared/components/search-box/search-box.component';
import { Company } from '../../../../../shared/model/company';
import {AddPriceComponent} from './add-price/add-price.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-prices',
  imports: [AddButtonComponent, SearchBoxComponent, DynamicTableComponent, AddPriceComponent],
  providers: [BsModalService],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss',
})
export class PricesComponent implements OnInit {
//Utiliser @ViewChild pour obtenir une référence au template de la modale.
  @ViewChild('content', { static: false }) modalContent?: TemplateRef<any>;

  title = signal('prices.title');
  labelButton = signal('prices.addButton');

  actions: TableActionButton[] = [
    {
      label: 'prices.actions.edit',
      icon: 'fas fa-pencil-alt text-success',
      doAction: (item: Price) => this.edit(item), // On passe juste l'objet 'Price'
    },
  ];

  modalRef?: BsModalRef;
  private modalService = inject(BsModalService);

  priceListResponse = input.required<Price[]>();
  searchTerm = signal<string>('');
  columns = signal<(keyof Price | string)[]>([ // Le type peut inclure 'string' pour les clés calculées
    'priceListName',
    'company',
    'laborerPrice',
    'technicianPrice',
    'patronPrice',
  ]);
  priceEdit = signal<Price | null>(null); // Initialiser à null pour plus de clarté
  productVariant = input.required<ProductVariant>(); // Initialiser à null pour plus de clarté

  ngOnInit(): void {

    this.priceListResponse().forEach((item: Price) => {
      item.laborerPrice = item.priceListAttribute?.laborerPrice;
      item.patronPrice = item.priceListAttribute?.patronPrice;
      item.technicianPrice = item.priceListAttribute?.technicianPrice;
      item.company = (item.company as Company)?.code;
    });
  }

  filteredData = computed(() =>
    filterDataByTerm(this.priceListResponse(), this.searchTerm(), this.columns() as (keyof Price)[])
  );

  /**
   * Ouvre la modale.
   * Si aucun prix n'est fourni, c'est un ajout (on réinitialise le signal).
   * Si un prix est fourni, c'est une édition.
   */
  openModal(price: Price | null = null) {
    this.priceEdit.set(price);

    if (this.modalContent) {
      this.modalRef = this.modalService.show(this.modalContent);
    } else {
      console.error("Le template de la modale n'a pas été trouvé.");
    }
  }

  private edit(price: Price): void {
    this.openModal(price);
  }

}

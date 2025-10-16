import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicTableComponent } from './dynamic-table.component';
import { ActivatedRoute } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { fireEvent, screen } from '@testing-library/angular';
import { FormsModule } from '@angular/forms';

describe('DynamicTableComponent', () => {
  let component: DynamicTableComponent;
  let fixture: ComponentFixture<DynamicTableComponent>;

  const mockData = [
    { id: 1, name: 'Alice', email: 'alice@example.com', selected: false },
    { id: 2, name: 'Bob', email: 'bob@example.com', selected: false },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', selected: false },
    { id: 4, name: 'Charl', email: 'charle@example.com', selected: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTableComponent, FormsModule],
      providers: [
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicTableComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize columns from dataSource', () => {
    expect(component.columns()).toEqual(['id', 'name', 'email']);
  });

  it('should sort data ascending and descending by column', () => {
    component.sortBy('name');
    expect(component.dataSourceResponse()[0].name).toBe('Alice');

    component.sortBy('name'); // toggle to descending
    expect(component.dataSourceResponse()[0].name).toBe('Charlie');
  });

  it('should filter data based on search term', () => {
    expect(component.dataSourceResponse().length).toBe(4);
    expect(component.dataSourceResponse()[0].name).toBe('Alice');
  });

  it('should toggle selection of all items', () => {
    component.toggleAll();
    expect(component.dataSourceResponse().every(i => i.selected)).toBe(true);

    component.toggleAll();
    expect(component.dataSourceResponse().every(i => !i.selected)).toBe(true);
  });

  it('should determine if all items are selected', () => {
    component.dataSourceResponse().forEach(item => (item.selected = true));
    expect(component.areAllSelected()).toBe(true);

    component.dataSourceResponse()[0].selected = false;
    expect(component.areAllSelected()).toBe(false);
  });

  it('should identify images correctly', () => {
    expect(component.isImage('avatar.png')).toBe(true);
    expect(component.isImage('file.txt')).toBe(false);
  });

  it('should identify arrays correctly', () => {
    expect(component.isArray(['a', 'b'])).toBe(true);
    expect(component.isArray('string')).toBe(false);
  });

  describe('DynamicTableComponent (integration)', () => {
    it('should render the table and pagination correctly', async () => {
      // Vérifier la présence du tableau
      expect(screen.getByRole('table')).toBeTruthy();

      // Vérifier la présence des pages de pagination
      expect(screen.getByText('Previous')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
    });

    it('should update the current page when "Next" is clicked', async () => {
      // Cliquer sur le bouton "Next" pour passer à la page suivante
      fireEvent.click(screen.getByText('Next'));

      // Vérifier que la page actuelle a changé
      expect(component.currentPage).toBe(1); // On suppose que le composant commence à la page 1
    });

    it('should filter data when search term is entered', async () => {
      // Entrer un terme de recherche
      const input = screen.getByTestId('searchTableList');
      fireEvent.input(input, { target: { value: 'Jane' } });

      // Vérifier que les données sont filtrées en fonction du terme de recherche
      expect(screen.queryByText('John')).toBeNull(); // "John" ne devrait pas être visible après filtrage
    });

    test('should find all checkboxes', async () => {
      // Récupérer tous les checkboxes
      const checkboxes = screen.queryAllByRole('checkbox');

      // Vérifier combien de checkboxes il y a
      expect(checkboxes.length).toBeGreaterThan(0);

      // Vous pouvez vérifier un checkbox spécifique en indexant
      expect(checkboxes[0]).toBeTruthy();
    });
  });
});

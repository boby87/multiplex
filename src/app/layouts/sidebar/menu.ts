export interface MenuItem {
  id?: number;
  label: string;
  icon?: string;
  webRoute?: string;
  children?: MenuItem[];
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
  platforms?: string[];
  allowedRoles?: string[];
}
export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Tableau de Bord',
    icon: 'fa-tachometer-alt',
    webRoute: '/dashboard',
    platforms: ['web', 'mobile'],
    allowedRoles: ['ROLE_ADMIN_BES', 'ROLE_PRICE_MANAGER_FACTORY'],
  },

  {
    id: 14,
    label: 'Configuration',
    icon: 'fa-cogs',
    webRoute: '/settings',
    platforms: ['web'],
    allowedRoles: ['ROLE_ADMIN_BES'],
    children: [
      {
        id: 15,
        label: 'Structure Société',
        icon: 'fa-building',
        webRoute: '/configuration/structure_societe',
        children: [
          {
            id: 16,
            label: 'Sociétés',
            webRoute: '/configuration/structure_societe/companies',
            icon: 'fa-list',
          },
          {
            id: 17,
            label: 'Départements',
            webRoute: '/configuration/structure_societe/departements',
            icon: 'fa-sitemap',
          },
          {
            id: 18,
            label: 'Jobs',
            webRoute: '/configuration/structure_societe/jobs',
            icon: 'fa-id-badge',
          },
        ],
      },
      {
        id: 19,
        label: 'Utilisateur & role',
        icon: 'fa-user-shield',
        webRoute: '/configuration/users_roles',
        children: [
          {
            id: 20,
            label: 'Utilisateurs',
            webRoute: '/configuration/users_roles/users',
            icon: 'fa-user',
          },
          {
            id: 21,
            label: 'Groupes / Rôles',
            webRoute: '/configuration/users_roles/roles',
            icon: 'fa-user-tag',
          },
          {
            id: 21,
            label: "Contrôle d'Accès Modèles (ACL)",
            webRoute: '/configuration/users_roles/acls',
            icon: 'fa-user-tag',
          },
        ],
      },
      {
        id: 22,
        label: 'Catalogue',
        icon: 'fa-boxes',
        webRoute: '/configuration/catalogue',
        children: [
          {
            id: 23,
            label: 'Articles de Base',
            webRoute: '/configuration/catalogue/base-articles',
            icon: 'fa-list',
          },
          {
            id: 24,
            label: "Variantes d'Articles",
            webRoute: '/configuration/catalogue/variants-articles',
            icon: 'fa-layer-group',
          },
          {
            id: 25,
            label: 'Catégorie',
            webRoute: '/configuration/catalogue/categories',
            icon: 'fa-folder',
          },
          {
            id: 26,
            label: 'Unité de Mesure',
            webRoute: '/configuration/catalogue/unite-of-measure',
            icon: 'fa-balance-scale',
          },
        ],
      },
      {
        id: 27,
        label: 'Tarification',
        icon: 'fa-file-invoice-dollar',
        webRoute: '/configuration/tarification',
        children: [
          {
            id: 28,
            label: 'Listes de Prix',
            webRoute: '/configuration/tarification/prices',
            icon: 'fa-list',
          },
        ],
      },
    ],
  },
  {
    id: 29,
    label: 'Ressources Humaines',
    icon: 'fa-id-card',
    webRoute: '/human_resources',
    platforms: ['web'],
    allowedRoles: ['ROLE_ADMIN_BES', 'ROLE_PRICE_MANAGER_FACTORY'],
    children: [
      {
        id: 30,
        label: 'Employés',
        webRoute: '/human_resources/employees',
        icon: 'fa-user-friends',
      },
    ],
  },
  {
    id: 31,
    icon: 'fa-handshake',
    label: 'CRM & Marketing',
    webRoute: '/crm_marketing',
    platforms: ['web'],
    allowedRoles: ['ROLE_ADMIN_BES', 'ROLE_PRICE_MANAGER_FACTORY'],
    children: [
      {
        id: 32,
        icon: 'fa-tools',
        label: 'Techniciens Physiques',
        webRoute: '/crm_marketing/techniciens-physiques',
      },
      {
        id: 33,
        icon: 'fa-suitcase',
        label: 'Techniciens Business',
        webRoute: '/crm_marketing/technicians-business',
      },
    ],
  },
  {
    id: 34,
    label: 'Paramètres Généraux',
    icon: 'fa-coins',
    webRoute: '/general_settings',
    platforms: ['web'],
    children: [
      {
        id: 35,
        label: 'Listes de Valeurs',
        icon: 'fa-certificate',
        webRoute: '/general_settings/values-listing',
        children: [
          /* {
            id: 36,
            label: 'Domaines d\'Activités',
            route: '/general_settings/values-listing/activities',
            icon: 'fa-charging-station',
          },*/
          {
            id: 37,
            label: 'Spécialités Techniques',
            webRoute: '/general_settings/skills',
            icon: 'fa-crop',
          },
          /*{
            id: 38,
            label: 'Formes Juridiques',
            route: '/general_settings/Juridiques',
            icon: 'fa-crow',
          },*/
        ],
      },
    ],
  },
];

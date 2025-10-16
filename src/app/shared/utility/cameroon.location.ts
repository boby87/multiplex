// fichier: cameroon-location.service.ts

// fichier: location.model.ts

export interface District {
  name: string;
}

export interface City {
  name: string;
  districts: District[];
}

export interface Region {
  name: string;
  cities: City[];
}

export class CameroonLocation {

  private static regions: Region[] = [
    {
      name: 'Centre',
      cities: [
        {
          name: 'Yaoundé',
          districts: [
            { name: 'Bastos' },
            { name: 'Mokolo' },
            { name: 'Essos' },
            { name: 'Melen' },
            { name: 'Nsam' },
            { name: 'Etoudi' }
          ]
        },
        {
          name: 'Mbalmayo',
          districts: [
            { name: 'Akok' },
            { name: 'Nkolbisson' },
            { name: 'Nko\'ovos' }
          ]
        }
      ]
    },
    {
      name: 'Littoral',
      cities: [
        {
          name: 'Douala',
          districts: [
            { name: 'Bonanjo' },
            { name: 'Akwa' },
            { name: 'Bonabéri' },
            { name: 'Deïdo' },
            { name: 'New Bell' },
            { name: 'Makepe' },
            { name: 'Logbaba' }
          ]
        },
        {
          name: 'Nkongsamba',
          districts: [
            { name: 'Quartier 4' },
            { name: 'Quartier 2' },
            { name: 'Baré-Bakem' }
          ]
        }
      ]
    }
    // Ajoute ici les autres régions selon le même modèle
  ];


 static getAllRegions(): Region[] {
    return this.regions;
  }

 static getCitiesByRegion(regionName: string): string[] {
    const region = this.regions.find(r => r.name.toLowerCase() === regionName.toLowerCase());
    return region ? region.cities.map(city => city.name) : [];
  }

 static getDistrictsByCity(cityName: string): string[] {
    for (const region of this.regions) {
      const city = region.cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      if (city) {
        return city.districts.map(d => d.name);
      }
    }
    return [];
  }
}

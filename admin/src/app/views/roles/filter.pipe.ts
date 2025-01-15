// src/app/shared/pipes/filter.pipe.ts 
// o 
// src/app/roles/pipes/filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Verifica si el item y el nombre existen antes de aplicar toLowerCase
      if (item && item.Nombre) {
        return item.Nombre.toLowerCase().includes(searchText);
      }
      return false;
    });
  }
}
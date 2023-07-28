export interface PackList {
  name: string;
  id: number;
  items: PackItem[];
  shareId: string;
}

export class PackItem {
  constructor(public id: number, public item: Item, public checked: boolean, public checkedAtTime: number | undefined, public person?: Template | undefined) {
  }

  get description(): string {
    if (this.person) {
      if (this.person.name.endsWith('s')) {
        return this.person.name + ' ' + this.item.name;
      }
      return this.person.name + 's ' + this.item.name;
    }
    return this.item.name;
  }

  get category(): string | null {
    return this.item.category;
  }
}

export interface Item {
  name: string;
  category: string | null;
  id: number;
}

export interface Template {
  id: number;
  name: string;
  order: number;
}

export interface TemplateItem {
  id: number;
  persons: Template[] | undefined;
  destinations: Template[] | undefined;
  durations: Template[] | undefined;
  activities: Template[] | undefined;
  item: Item;
}

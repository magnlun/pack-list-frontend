export interface PackList {
  name: string;
  id: number;
  items: PackItem[];
  shareId: string;
}

export class PackItem {
  constructor(public id: number, public item: Item, public checked: boolean) {
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

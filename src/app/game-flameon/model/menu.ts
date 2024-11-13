export interface Item {
    id: string;
    name: string;
    ingredients: string[];
  }
  
export interface Menu {
    menuItems: Item[];
}
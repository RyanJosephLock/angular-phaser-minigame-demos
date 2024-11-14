export interface Item {
    id: string;
    name: string;
    extraValid: number[];
    ingredients: string[];
  }
  
export interface Menu {
    menuItems: Item[];
    extraItems: string[];
}
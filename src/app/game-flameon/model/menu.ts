export interface Item {
    id: string;
    name: string;
    ingredientScore: number;
    finishScore: number;
    extraValid: number[];
    ingredients: string[];
  }
  
export interface Menu {
    menuItems: Item[];
    extraItems: string[];
}
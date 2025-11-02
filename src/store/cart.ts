type CartItem = {
  productId: number;
  productName: string;
  skuId: number;
  price: number;
  image?: string;
};

class Cart {
  private items: CartItem[] = [];

  addItem(item: CartItem) {
    this.items.push(item);
  }

  getItems() {
    return this.items;
  }

  clear() {
    this.items = [];
  }
}

export default new Cart();
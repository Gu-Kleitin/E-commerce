export class ProductModel {
  constructor(id, name, description, photo, price, stock, inStock,category) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.photo = photo;
    this.price = price;
    this.stock = stock;
    this.inStock = inStock;
    this.emExposicao = inStock;
    this.category = category;
  }
}

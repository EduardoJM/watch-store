const productsSeeder = (server) => {
  server.createList('product', 25);
};

export default function seeds(server) {
  productsSeeder(server);
}

import PageWrapper from "@/components/layout/PageWrapper";

const vegetables = [
  {
    id: 1,
    name: "Spinach",
    price: 40,
    vitamins: ["A", "C", "K"],
  },
  {
    id: 2,
    name: "Carrot",
    price: 60,
    vitamins: ["A", "B6"],
  },
];

export default function VegetablesPage() {
  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">
        Today's Vegetable Prices
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {vegetables.map((veg) => (
          <div
            key={veg.id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-2">
              {veg.name}
            </h2>
            <p>Price: ₹{veg.price} / kg</p>
            <p>Vitamins: {veg.vitamins.join(", ")}</p>

            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

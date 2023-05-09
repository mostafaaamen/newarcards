export const PriceOrder = (data) => {
  const result = {};
  data.forEach((o) => {
    const month = new Date(o.date).toLocaleString("en-US", { month: "long" });
    const totalPrice = o.cards.reduce((acc, card) => acc + card.totalPrice, 0);
    if (!result[month]) {
      result[month] = 0;
    }
    result[month] += totalPrice;
  });
  return result;
};

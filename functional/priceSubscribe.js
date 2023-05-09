export const PriceSubscribe = (data) => {
  const result = {};
  data.forEach((o) => {
    const month = new Date(o.date).toLocaleString("en-US", { month: "long" });
    const { price } = o.subscribe;
    if (!result[month]) {
      result[month] = 0;
    }
    result[month] += price;
  });
  return result;
};

import { Tag } from "antd";
export const formatPriceWithColor = (price, type) => {
  if (price === undefined || price === null || isNaN(price)) {
    return <Tag color="default">—</Tag>;
  }
  const formattedPrice = `$${Number(price).toLocaleString()}`;

  let color = "blue";
  if (type === "base") color = "volcano";
  if (type === "weekday_12_17") color = "gold";
  if (type === "weekday_17_21") color = "orange";
  if (type === "weekday_after_21") color = "magenta";
  if (type === "weekend") color = "purple";

  return <Tag color={color}>{formattedPrice}</Tag>;
};

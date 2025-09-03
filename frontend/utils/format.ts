export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

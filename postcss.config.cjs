module.exports = {
  plugins: [
    require('postcss-nested'), // Đặt trước tailwindcss
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};

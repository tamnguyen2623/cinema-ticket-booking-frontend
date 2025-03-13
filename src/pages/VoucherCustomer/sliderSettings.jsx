const sliderSettings = {
  dots: true, // Hiển thị chấm tròn phía dưới
  infinite: false, // Lặp lại carousel vô hạn
  speed: 500,
  slidesToShow: 3, // Hiển thị 3 voucher mỗi lần
  slidesToScroll: 1,
  centerMode: false, // Giúp căn giữa các slide
  centerPadding: "0px", // Loại bỏ padding dư
  variableWidth: false, // Ngăn item có kích thước không đồng đều
  adaptiveHeight: true, // Đảm bảo chiều cao đồng bộ
//   responsive: [
//     {
//       breakpoint: 1024, // Khi màn hình nhỏ hơn 1024px
//       settings: {
//         slidesToShow: 2,
//         centerMode: false,
//         centerPadding: "0px",
//       },
//     },
//     {
//       breakpoint: 768, // Khi màn hình nhỏ hơn 768px
//       settings: {
//         slidesToShow: 1,
//         centerMode: false, // Tắt căn giữa khi chỉ có 1 voucher
//         centerPadding: "0px",
//       },
//     },
//   ],
};

export default sliderSettings;

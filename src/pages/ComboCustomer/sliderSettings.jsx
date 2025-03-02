const sliderSettings = {
  dots: true, // Hiển thị chấm tròn chỉ mục
  infinite: true, // Lặp lại slider vô hạn
  speed: 500, // Tốc độ chuyển đổi
  slidesToShow: 3, // Số lượng combo hiển thị cùng lúc
  slidesToScroll: 1, // Số combo trượt mỗi lần
  centerMode: true, // Giúp căn giữa các slide
  centerPadding: "0px", // Loại bỏ padding dư thừa
  adaptiveHeight: true, // Đồng bộ chiều cao các item
  responsive: [
    {
      breakpoint: 1024, // Khi màn hình nhỏ hơn 1024px
      settings: {
        slidesToShow: 2,
        centerMode: true,
        centerPadding: "0px",
      },
    },
    {
      breakpoint: 768, // Khi màn hình nhỏ hơn 768px
      settings: {
        slidesToShow: 1,
        centerMode: false, // Tắt căn giữa khi chỉ có 1 combo
        centerPadding: "0px",
      },
    },
  ],
};

export default sliderSettings;

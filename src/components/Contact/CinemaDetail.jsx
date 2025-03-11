import React, { useState, useEffect } from "react";
import { Typography } from "antd";
const { Title } = Typography;

export default function CinemaDetail({ cinema }) {
  return (
    <div className="contact__cinema-detail">
      <Title>{cinema?.name}</Title>
      <p><strong>Hotline: </strong>+84 ({cinema?.phoneNumber}0918668208)</p>
      <p><strong>Address: </strong>{cinema?.address}</p>
      <br/>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.790973407156!2d105.78607939999999!3d10.0341005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a062a1b96326ad%3A0xfbd180a2dbc512c4!2sCGV%20Sense%20Cityscape!5e0!3m2!1svi!2s!4v1741662723966!5m2!1svi!2s"
        // src={cinema?.map}
        width="100%"
        height="450"
        style={{border:0}}
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Typography } from "antd";
const { Title } = Typography;

export default function CinemaDetail({ cinema }) {
  return (
    <div className="contact__cinema-detail">
      <Title>{cinema?.name}</Title>
      <p><strong>Hotline: </strong>+84 ({cinema?.phoneNumber})</p>
      <p><strong>Address: </strong>{cinema?.address}</p>
      <br/>
      <iframe
        src={cinema?.map}
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

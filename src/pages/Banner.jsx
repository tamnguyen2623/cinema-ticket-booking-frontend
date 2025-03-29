import React, { useState, useEffect } from "react";
import BannerFilter from "../components/Banner/BannerFilter";
import BannerTable from "../components/Banner/BannerTable";
import BannerForm from "../components/Banner/BannerForm";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getAll,
  filterBanner,
  createBanner,
  updateBanner,
  updateIsDeleteBanner,
} from "../components/api/banner";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalType, setModalType] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, [searchTerm]);

  const fetchBanners = async () => {
    try {
      const data = searchTerm ? await filterBanner(searchTerm) : await getAll();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="title-ticket">List of banners</div>
      <div className="ticketListContainer">
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <BannerFilter setSearchTerm={setSearchTerm} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalType("add")}
          >
            Add Banner
          </Button>
        </div>
        <BannerTable
          banners={banners}
          setModalType={setModalType}
          setCurrentBanner={setCurrentBanner}
          updateIsDeleteBanner={updateIsDeleteBanner}
          fetchBanners={fetchBanners}
        />
      </div>
      {modalType && (
        <BannerForm
          modalType={modalType}
          setModalType={setModalType}
          currentBanner={currentBanner}
          fetchBanners={fetchBanners}
          createBanner={createBanner}
          updateBanner={updateBanner}
        />
      )}
    </div>
  );
}

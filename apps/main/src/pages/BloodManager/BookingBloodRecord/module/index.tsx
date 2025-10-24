import BookingBloodRecordView from "./BookingBloodRecordView";
import React, { useState, useEffect, memo } from 'react';
import { Spin } from "antd";

function BookingBloodRecordDrawer(props: any) {
  const { record = {}, drawerClose = null } = props;
  const [isRender, setIsRender] = useState(true);
  let Component = BookingBloodRecordView;
  return (
    isRender ? <Component record={record} drawerClose={drawerClose} /> : <Spin size="large"/>
  )
}
export default memo(BookingBloodRecordDrawer);
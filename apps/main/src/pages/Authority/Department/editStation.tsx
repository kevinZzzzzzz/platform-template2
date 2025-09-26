import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Switch } from 'antd';
import React, { useState, useEffect, memo } from 'react';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  style: {
    width: '80%',
  }
};
const deptScopes = [
  { value: 'E', label: '医院' },
  { value: 'F', label: '血站' },
  // { value: 'G', label: '监管平台' },
  { value: 0, label: '科室' },
];
function EditStation(props: any) {
  const {editType, staHosList} = props;
	const [editDeptForm] = Form.useForm();

    
  return (
    <>
    </>
  )
}
export default memo(EditStation)

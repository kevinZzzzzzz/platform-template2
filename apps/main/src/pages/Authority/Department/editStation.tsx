import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Space, Switch } from 'antd';
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
const developCompany = [
  { value: 0, label: '穿越' },
  { value: 1, label: '唐山' }
]
function EditStation(props: any) {
  const {editType, dictArea, changeEditObjectType, editData, handleSaveFun} = props;
	const [editStationForm] = Form.useForm();
  
  useEffect(() => {
    if (editType === 'add') {
      editStationForm.setFieldsValue({
        areaId: !('areaId' in editData) ? editData.id : null,
        name: '',
        deptScope: 'F',
        parentId: null,
        developCompany: null,
        stationIp: '',
        coordinates: '',
        deptNo: '',
        scope: null,
        delFlag: false,
        orderNum: null
      })
    } else {
      editStationForm.setFieldsValue({
        ...editData,
        deptScope: 'F',
        delFlag: !!editData.delFlag
      })
    }
  }, [editType, editData])
  const submitFun = async() => {
    const valid = await editStationForm.validateFields();
    if (!valid) {
      return;
    }
		const values = editStationForm.getFieldsValue();
		handleSaveFun(values, () => {
      editStationForm.resetFields();
    });
  }
    
  return (
    <Form form={editStationForm} {...layout} onFinish={submitFun}>
      <Form.Item name="areaId" label="所属地域" rules={[{ required: true, message: '请选择所属地域' }]}>
        <Select options={dictArea} allowClear placeholder='请选择所属地域' />
      </Form.Item>
      <Form.Item name="name" label="医院名称" rules={[{ required: true, message: '请输入医院名称' }]}>
        <Input placeholder='医院名称' allowClear/>
      </Form.Item>
      <Form.Item name='deptScope' label="机构类型" rules={[{ required: true, message: '请选择机构类型' }]}>
        <Select options={deptScopes} allowClear placeholder='请选择机构类型' onChange={(v) => changeEditObjectType(v)}/>
      </Form.Item>
      <Form.Item name='developCompany' label="血站厂商" rules={[{ required: true, message: '请选择血站厂商' }]}>
        <Select options={developCompany} allowClear placeholder='' />
      </Form.Item>
      <Form.Item name='stationIp' label="血站接口">
        <Input placeholder='' allowClear />
      </Form.Item>
      <Form.Item name='coordinates' label="地理坐标">
        <Input placeholder='经度,纬度。例如：106.66, 88.88' allowClear />
      </Form.Item>
      <Form.Item name='deptNo' label="机构编码">
        <Input placeholder='业务系统机构id' allowClear />
      </Form.Item>
      <Form.Item name='delFlag' label="是否启用">
        <Switch defaultChecked/>
      </Form.Item>
      <Form.Item name="orderNum" label="排序" rules={[{ required: true, message: '请输入排序' }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  )
}
export default memo(EditStation)

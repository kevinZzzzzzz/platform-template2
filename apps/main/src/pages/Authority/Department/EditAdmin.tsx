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
function EditStation(props: any) {
  const {editType, dictArea, editData, handleSaveFun} = props;
	const [editAdminForm] = Form.useForm();
  
  useEffect(() => {
    if (editType === 'add') {
      editAdminForm.setFieldsValue({
        areaId: null,
        name: '',
        parentId: null,
        deptId: null,
        telAccount: '',
        coordinates: '',
        deptNo: '',
        scope: null,
        delFlag: false,
        orderNum: null
      })
    } else {
      editAdminForm.setFieldsValue({
        ...editData,
        delFlag: !!editData.delFlag
      })
    }
  }, [editType, editData])
  const submitFun = async() => {
    const valid = await editAdminForm.validateFields();
    if (!valid) {
      return;
    }
		const values = editAdminForm.getFieldsValue();
		handleSaveFun(values, () => {
      editAdminForm.resetFields();
    });
  }
    
  return (
    <Form form={editAdminForm} {...layout} onFinish={submitFun}>
      <Form.Item name="areaId" label="所属地域" rules={[{ required: true, message: '请选择所属地域' }]}>
        <Select options={dictArea} allowClear placeholder='请选择所属地域' />
      </Form.Item>
      <Form.Item name="name" label="医院名称" rules={[{ required: true, message: '请输入医院名称' }]}>
        <Input placeholder='医院名称' allowClear/>
      </Form.Item>
      <Form.Item name='telAccount' label="业务系统医院账号">
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder='业务系统医院账号，例：账号#密码' allowClear />
          <Button type='primary'>生成密码</Button>
        </Space.Compact>
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

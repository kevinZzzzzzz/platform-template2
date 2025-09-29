import { testTelAccountApi } from '@/api/modules/login';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Select, Space, Switch } from 'antd';
import React, { useState, useEffect, memo, useMemo } from 'react';

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
  const {editType, dictArea, stationList, changeEditObjectType, editData, handleSaveFun} = props;
	const [editHospitalForm] = Form.useForm();
  const telWatch = Form.useWatch('telAccount', editHospitalForm);

  const telDisable = useMemo(() => telWatch === '', [telWatch]);

  
  useEffect(() => {
    if (editType === 'add') {
      editHospitalForm.setFieldsValue({
        areaId: !('areaId' in editData) ? editData.id : null,
        name: '',
        deptScope: 'E',
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
      editHospitalForm.setFieldsValue({
        ...editData,
        deptScope: 'E',
        deptId: editData.deptId,
        delFlag: !!editData.delFlag
      })
    }
  }, [editType, editData])
  const submitFun = async() => {
    const valid = await editHospitalForm.validateFields();
    if (!valid) {
      return;
    }
		const values = editHospitalForm.getFieldsValue();
		handleSaveFun(values, () => {
      editHospitalForm.resetFields();
    });
  }
  /**
   * 验证账号
   */
  const verifyAccount = async () => {
    const {telAccount} = editHospitalForm.getFieldsValue();
    console.log(telAccount);
    if (!telAccount || !telAccount.includes('#')) {
      message.error('请输入正确的业务系统医院账号，例：账号#密码');
      return;
    }
    let username = telAccount.split('#')[0]
    let password = telAccount.split('#')[1]
    testTelAccountApi({
      username,
      password
    })
  }
  return (
    <Form form={editHospitalForm} {...layout} onFinish={submitFun}>
      <Form.Item name="areaId" label="所属地域" rules={[{ required: true, message: '请选择所属地域' }]}>
        <Select options={dictArea} allowClear placeholder='请选择所属地域' />
      </Form.Item>
      <Form.Item name="name" label="医院名称" rules={[{ required: true, message: '请输入医院名称' }]}>
        <Input placeholder='医院名称' allowClear/>
      </Form.Item>
      <Form.Item name='deptScope' label="机构类型" rules={[{ required: true, message: '请选择机构类型' }]}>
        <Select options={deptScopes} allowClear placeholder='请选择机构类型' onChange={(v) => changeEditObjectType(v)}/>
      </Form.Item>
      <Form.Item name='stationId' label="所属血站" rules={[{ required: true, message: '请选择所属血站' }]}>
        <Select options={stationList} allowClear placeholder='请选择所属血站' />
      </Form.Item>
      <Form.Item name='telAccount' label="业务系统医院账号">
        <Input suffix={<Button size='small' type='primary' disabled={telDisable} onClick={() => verifyAccount()}>验证账号</Button>} placeholder='业务系统医院账号，例：账号#密码' allowClear />
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

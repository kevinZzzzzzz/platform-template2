import usePrint from "@/hooks/usePrint";
import { Button, Form, FormProps, Input } from "antd";
import React, { useState, useEffect, memo } from "react";
import styles from './index.module.less'
function MyPrintComp(props: any) {
  const {printMachine} = usePrint()
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(printMachine)
  }, [form, printMachine])

  console.log(Object.keys(printMachine))
    
	const onFinish = values => {
		console.log("Success:", values);
	};

	const onFinishFailed = errorInfo => {
		console.log("Failed:", errorInfo);
	};
  return (
    <div className={styles.MyPrintComp}>
			<Form
        form={form}
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
        {
          Object.keys(printMachine).map((key) => {
            return (
              <Form.Item label={key} name={printMachine[key]} key={key} rules={[{ required: true, message: "请输入" }]}>
                <Input />
              </Form.Item>
            )
          })
        }

				<Form.Item label={null}>
					<Button type="primary" htmlType="submit">
						确认
					</Button>
				</Form.Item>
			</Form>
		</div>
  )
}
export default memo(MyPrintComp)
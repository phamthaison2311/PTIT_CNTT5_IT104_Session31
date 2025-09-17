import { useState } from "react";
import { Modal, Form, Input, Button, Spin, message } from "antd";
import ReactQuill from "react-quill-new";
import axios from "axios";

type ArticleForm = {
  title: string;
  image: string;
  content: string;
};

export default function AddArticleModal() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<ArticleForm>();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const payload = {
        ...values,
        content,
        status: "published",
        date_written: new Date().toLocaleDateString("vi-VN"),
      };

      await axios.post("http://localhost:3000/article", payload);

      message.success("Xuất bản thành công. Đang tải dữ liệu...");
      form.resetFields();
      setContent("");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      message.error("Xuất bản thất bại. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setContent("");
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        className="add-article"
      >
        Thêm bài viết mới
      </Button>

      <Modal
        title="Thêm mới bài viết"
        open={open}
        onCancel={() => !loading && setOpen(false)}
        maskClosable={!loading}
        closable={!loading}
        footer={
          <>
            <Button onClick={handleReset} disabled={loading}>
              Làm mới
            </Button>
            <Button type="primary" onClick={handlePublish} loading={loading}>
              Xuất bản
            </Button>
          </>
        }
        width={720}
      >
        <Spin spinning={loading} tip="Đang xuất bản...">
          <Form
            form={form}
            layout="vertical"
            initialValues={{ title: "", image: "" }}
            disabled={loading}
          >
            <Form.Item
              label="Tên bài viết"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tên bài viết" />
            </Form.Item>

            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[
                { required: true, message: "Vui lòng nhập URL ảnh" },
                { type: "url" as const, message: "URL không hợp lệ" },
              ]}
            >
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item label="Nội dung" required>
              <div className="quill-wrapper">
                <ReactQuill value={content} onChange={setContent} />
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}

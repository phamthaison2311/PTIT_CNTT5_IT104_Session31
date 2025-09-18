import React, { useState, useEffect } from "react";
import { Table, Tag, Image, Space, Button, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

type Post = {
  id: number;
  title: string;
  image?: string;
  thumbnail?: string;
  date_written?: string;
  status: "published" | "blocked";
};

export default function TableArticle() {
  const [article, setArticle] = useState<Post[]>([]);
  const [blockingIds, setBlockingIds] = useState<number[]>([]);
  


  useEffect(() => {
    axios
      .get("http://localhost:3000/article")
      .then((res) => setArticle(res.data))
      .catch((err) => console.error("Lỗi không thể lấy API", err));
  }, []);

  const statusMap: Record<Post["status"], { color: string; text: string }> = {
    published: { color: "green", text: "Đã xuất bản" },
    blocked: { color: "red", text: "Ngừng xuất bản" },
  };

  const handleBlock = async (record: Post) => {
    if (record.status === "blocked") {
      message.info("Bài viết đã ở trạng thái Ngừng xuất bản");
      return;
    }

    const prev = article;
    const next = article.map((x) =>
      x.id === record.id ? { ...x, status: "blocked" } : x
    );
    setArticle(next);
    setBlockingIds((ids) => [...ids, record.id]);

    try {
      await axios.patch(`http://localhost:3000/article/${record.id}`, {
        status: "blocked",
      });
      message.success(`Đã chuyển sang "Ngừng xuất bản": ${record.title}`);
    } catch (e) {
      setArticle(prev);
      message.error("Chặn thất bại, vui lòng thử lại");
      console.error(e);
    } finally {
      setBlockingIds((ids) => ids.filter((id) => id !== record.id));
    }
  };

  const handleUnblock = async (record: Post) => {
    if (record.status === "published") {
      message.info("Bài viết đã ở trạng thái Xuất bản");
      return;
    }

    const prev = article;
    const next = article.map((x) =>
      x.id === record.id ? { ...x, status: "published" } : x
    );
    setArticle(next);
    setBlockingIds((ids) => [...ids, record.id]);

    try {
      await axios.patch(`http://localhost:3000/article/${record.id}`, {
        status: "published",
      });
      message.success(`Đã bỏ chặn: ${record.title}`);
    } catch (e) {
      setArticle(prev);
      message.error("Bỏ chặn thất bại, vui lòng thử lại");
      console.error(e);
    } finally {
      setBlockingIds((ids) => ids.filter((id) => id !== record.id));
    }
  };

  const columns: ColumnsType<Post> = [
    {
      title: "STT",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      align: "center",
      width: 120,
      render: (_src: string, record: Post) => (
        <Image
          src={record.image || record.thumbnail}
          width={48}
          height={48}
          style={{ objectFit: "cover", borderRadius: 24 }}
          preview={false}
          fallback="https://via.placeholder.com/48"
        />
      ),
    },
    {
      title: "Ngày viết",
      dataIndex: "date_written",
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 160,
      render: (s: Post["status"]) => {
        const m = statusMap[s];
        return <Tag color={m.color}>{m.text}</Tag>;
      },
    },
    {
      title: "Chức năng",
      key: "actions",
      align: "right",
      width: 260,
      render: (_: unknown, record: Post) => {
        const loading = blockingIds.includes(record.id);
        return (
          <Space>
            {record.status === "blocked" ? (
              <Popconfirm
                title="Bỏ chặn bài viết?"
                okText="Bỏ chặn"
                cancelText="Huỷ"
                onConfirm={() => handleUnblock(record)}
              >
                <Button type="primary" ghost loading={loading}>
                  Bỏ chặn
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Chặn bài viết?"
                okText="Chặn"
                cancelText="Huỷ"
                onConfirm={() => handleBlock(record)}
              >
                <Button type="primary" ghost loading={loading}>
                  Chặn
                </Button>
              </Popconfirm>
            )}

            <Button onClick={() => message.info(`Sửa: ${record.title}`)}>
              Sửa
            </Button>

            <Popconfirm
              title="Xác nhận xoá?"
              okText="Xoá"
              cancelText="Huỷ"
              onConfirm={() => message.success(`Đã xoá: ${record.title}`)}
            >
              <Button danger>Xoá</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={article}
      pagination={false}
      bordered
      size="middle"
    />
  );
}

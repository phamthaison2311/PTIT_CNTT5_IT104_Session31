export default function FilterArticle() {
  return (
    <form className="filter-article">
      <input type="text" placeholder="Nhập từ khóa tìm kiếm" />
      <select>
        <option>Lọc bài viết</option>
        <option value="date">Lọc theo ngày</option>
        <option value="status">Lọc theo trạng thái</option>
      </select>
    </form>
  );
}

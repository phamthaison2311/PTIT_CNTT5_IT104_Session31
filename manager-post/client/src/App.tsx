import FilterArticle from "./components/FilterArticle";
import TableArticle from "./components/TableArticle";
import AddArticleModal from "./components/AddArticleModal";
import "quill/dist/quill.snow.css";

export default function App() {
  return (
    <>
      {/* Tìm kiếm bài viết và lọc bài viết*/}
      <div className="header">
        <FilterArticle />
        <AddArticleModal />
      </div>
      <TableArticle />
    </>
  );
}

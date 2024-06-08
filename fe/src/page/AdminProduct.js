import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import SearchBox from "../component/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../action/productAction";
import NewItemDialog from "../component/NewItemDialog";
import * as types from "../constants/product.constants";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import { commonUiActions } from "../action/commonUiAction";
import ProductTable from "../component/ProductTable";
import AlertModal from '../component/AlertModal';

const AdminProduct = () => {
  const navigate = useNavigate();
  const { productList, totalPageNum } = useSelector(state=>state.product);
  const [query, setQuery] = useSearchParams();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  const [mode, setMode] = useState("new");
  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  // < 상품리스트 가져오기 (url쿼리 맞춰서) >
  useEffect(()=>{
    dispatch(productActions.getProductList({...searchQuery}));
  },[query]);

  // < 검색어나 페이지가 바뀌면 url바꿔주기 >
  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어 또는 페이지가 바뀜 => url 바꿔줌=> 
    //url쿼리 읽어옴 => 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery === ""){
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate("?" + query);
  }, [searchQuery]);

  // < 아이템 삭제하기 >
  const deleteItem = (id, name) => {
    setSelectedId(id);
    setSelectedName(name);
    setShowModal(true);
  };

  // < 상품 수정하기 form 열기 >
  const openEditForm = (product) => {
    //edit모드로 설정하고
    setMode("edit");
    // 아이템 수정다이얼로그 열어주기
    dispatch({type: types.SET_SELECTED_PRODUCT, payload: product});
    setShowDialog(true);
  };

   // < 상품 생성하기 form 열기 >
  const handleClickNewItem = () => {
    //new 모드로 설정하고 (비어있는 폼)
    setMode("new");
    // 다이얼로그 열어주기
    setShowDialog(true);
  };

  // < 쿼리에 페이지값 바꿔주기 >
  const handlePageClick = ({ selected }) => {
    setSearchQuery({...searchQuery, page: selected +1});
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">          
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        {/* 상품 보여주는 리스트 */}
        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page-1} // 1페이지면 2임 여긴 한개씩 +1 해야함
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />

      <AlertModal 
        showModal={showModal}
        setShowModal={setShowModal}
        selectedId={selectedId}
        selectedName={selectedName}
      />

    </div>
  );
};

export default AdminProduct;

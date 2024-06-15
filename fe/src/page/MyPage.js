import React from "react";
import { useEffect, useState  } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../action/orderAction";
import { SortByLatest } from "../utils/number";
import ReactPaginate from "react-paginate";
import  LoadingSpinner  from "../component/LoadingSpinner";
import OrderStatusCard from "../component/OrderStatusCard";
import "../style/orderStatus.style.css";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList, totalPageNum } = useSelector((state) => state.order);
  const { loading } = useSelector((state) => state.order);
  const latestOrderList = SortByLatest(orderList);
  const [query, setQuery] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1
  }); //검색 조건들을 저장하는 객체
    
  //오더리스트 들고오기
  useEffect(()=>{
    dispatch(orderActions.getOrder({...searchQuery}));
  },[dispatch, searchQuery]);

    // < 페이지가 바뀌면 url바꿔주기 >
    useEffect(() => {
      // 페이지가 바뀌면 url바꿔주기 (검색어 또는 페이지가 바뀜 => url 바꿔줌=> 
      // url쿼리 읽어옴 => 이 쿼리값 맞춰서  상품리스트 가져오기)
      const params = new URLSearchParams(searchQuery);
      const queryString = params.toString();
      navigate("?" + queryString);
    }, [searchQuery, navigate]);

  // 쿼리에 페이지값 바꿔주기
  const handlePageClick = ({ selected }) => {
    setSearchQuery(prevQuery => ({
      ...prevQuery,
      page: selected + 1
    }));
  };


  return (
    <Container className="status-card-container">
      {latestOrderList.length === 0 || !latestOrderList ? (
          <Col xs={12} md={7}>
            <div className="text-align-center empty-bag">
              <h2>주문한 상품이 없습니다</h2>
              <Button
                variant="dark"
                className="payment-button"
                onClick={() => navigate("/")}
              >
                쇼핑 계속하기
              </Button>
            </div>
          </Col>
      ):(
        <>
          {latestOrderList.map((item)=>(
            <OrderStatusCard key={item._id} item={item}/>  
          ))}
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
        </>
      )}
    </Container>
  );
};

export default MyPage;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../action/productAction";
import { ColorRing } from "react-loader-spinner";
import  LoadingSpinner  from "../component/LoadingSpinner";
import { cartActions } from "../action/cartAction";
import { commonUiActions } from "../action/commonUiAction";
import { currencyFormat } from "../utils/number";
import LinkModal from '../component/LinkModal';
import "../style/productDetail.style.css";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector(state=>state.product);
  const loading = useSelector((state) => state.product.loading);
  const { linkModal } = useSelector((state) => state.ui);
  const item = selectedProduct?.data;
  const [size, setSize] = useState("");
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const [sizeError, setSizeError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  
  const stockValue = item?.stock ? Object.keys(item.stock).map((size) => (
    item.stock[size]
    )) : [];
    console.log("stock",stockValue )

  const allZero = stockValue?.every((value) => value === 0);

  const addItemToCart = () => {
    //사이즈를 아직 선택안했다면 에러
    if(size === ""){
      setSizeError(true);
      return;
    }
    // 아직 로그인을 안한유저라면 로그인페이지로
    if (!user) {
      dispatch(commonUiActions.showLinkModal("로그인 후 이용하실 수 있습니다. 로그인하시겠습니까?", "/login"));  
      setShowModal(true);
    }
    // 카트에 아이템 추가하기
    dispatch(cartActions.addToCart({ id, size }));
  };

  const selectSize = (value) => {
    // 사이즈 추가하기
    setSize(value);
    if(sizeError)setSizeError(false);
  };

  //카트에러가 있으면 에러메세지 보여주기

  //에러가 있으면 에러메세지 보여주기

  useEffect(() => {
    //상품 디테일 정보 가져오기
    dispatch(productActions.getProductDetail(id))
    console.log("selected", item)
  }, [id]);

  if (loading || !selectedProduct)
  return (
    <LoadingSpinner 
    />
  );

  return (
    <Container className="product-detail-card">
      <LinkModal 
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <Row>
        <Col sm={6}>
          <img
            src={item?.image}
            className="w-100"
            alt="image"
          />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{item?.name}</div>
          {item?.status === "active" && !allZero  ? "" : <div>품절</div>}
          <div className="product-info">₩ {item?.price}</div>
          <div className="product-info">{item?.description}</div>
          {item?.status === "active" && !allZero  ? 
            <Dropdown
              className="drop-down size-drop-down"
              title={size}
              align="start"
              onSelect={selectSize}
            >
              <Dropdown.Toggle
                className="size-drop-down"
                variant={sizeError ? "outline-danger" : "outline-dark"}
                id="dropdown-basic"
                align="start"
              >
                {size === "" ? "사이즈 선택" : size?.toUpperCase()}
              </Dropdown.Toggle>
              
              <Dropdown.Menu className="size-drop-down">
                {item?.stock && Object.keys(item.stock).map((size, index)=>(
                  <Dropdown.Item 
                    key={index} 
                    eventKey={size} 
                    className='dropdown-item'
                    disabled={item.stock[size] === 0}
                  >
                    
                    {/* 재고가 0이면 선택 못하게, 카트에서 재고보다 많이 못담게 */}
                    <div>
                      {item.stock[size] === 0 ? (<>{size.toUpperCase()} <div className='sold-out'> 품절</div></>
                       ) : item.stock[size] <= 5 ? (<>{size.toUpperCase()} <div className='stock'>재고: {item.stock[size]}</div></>) : ( size.toUpperCase())}
                    </div>
                  </Dropdown.Item>
                ))}              
              </Dropdown.Menu>
            </Dropdown>

            : ""
          }
          <div className="warning-message">
            {sizeError && "사이즈를 선택해주세요."}
          </div>
          {item?.status === "active" && !allZero ? 
            <Button variant="dark" className="add-button" onClick={addItemToCart}>
              추가
            </Button>
          : ""
          }

        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;

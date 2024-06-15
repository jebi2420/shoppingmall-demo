import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../action/userAction";
import { cartActions } from '../action/cartAction';
import { productActions } from "../action/productAction";
import * as types from "../constants/cart.constants";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemQty } = useSelector((state) => state.cart);
  // const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const [query, setQuery] = useSearchParams();
  const name = query.get("name");
  const menuList = [
    "All",
    "Top",
    "Pants",
    "Dress",
  ];
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    // 윈도우 리사이즈 이벤트 리스너 등록
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if(user){
      dispatch(cartActions.getCartQty());
    }
  },[user]);

  useEffect(() => {
    // URL에 query parameter가 없는 경우에만 input 값을 초기화
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has('name')) {
      setInputValue("");
    }
  }, [location]);

  // 검색 기능
  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      const query = event.target.value;
      if (query === "") {
        return navigate("/");
      }
      navigate(`/?name=${query}`);
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFocus = () => {
    // input에 마우스를 클릭했을 때 input 값을 초기화
    setInputValue("");
  };

  const getAllProducts = () => {
    dispatch(productActions.getProductList({name}));
  }

  // 카테고리 별 상품 가져오기
  const handleCategory = (menu) =>{
    console.log("category")
    navigate("/");
    const menuLowerCase = menu ? menu.toLowerCase() : null;
    dispatch(productActions.getProductList({name}, menuLowerCase));
  }

  // 로그아웃
  const logout = () => {
    dispatch(userActions.logout());
    dispatch({type: types.CLEAR_CART});
    navigate("/");
  };

  const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
  };
  
  return (
    <div>
      <div className="top-btn-container">
        <button className='top-btn' onClick={scrollToTop} type="button"> Top</button>
      </div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>


        {/* menuList mobile */}
        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button onClick={()=>handleCategory(menu)} key={index}>{menu}</button>
          ))}
        </div>
      </div>
      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>

        <div>
          <div className="display-flex">
            {user && user.level === "admin" && (
              <div class="admin-btn">
                <Link to="/admin/product?page=1" className="admin-link link-area">
                  Admin page
                </Link>
              </div>
            )}
            {user ? (
              <div onClick={logout} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인/회원가입</span>}
              </div>
            )}

            {/* 쇼핑백 */}
            <div onClick={() => navigate( user ? "/cart" : "/login")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                 user? cartItemQty : 0
                })`}</span>
              )}
            </div>

            {/* 내 주문 */}
            <div
              onClick={() => navigate(user ? "/account/purchase" : "/login")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div>
            {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-logo">
        <Link to="/" onClick={getAllProducts}>
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
      </div>
      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a onClick={()=>handleCategory(menu)}>{menu}</a>
            </li>
          ))}
        </ul>
        {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyPress={onCheckEnter}
              value={inputValue}
              onFocus={handleFocus}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

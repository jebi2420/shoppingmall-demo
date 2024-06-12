import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import JSConfetti from "js-confetti";
import "../style/paymentPage.style.css";

const OrderCompletePage = () => {
  const { orderNum } = useSelector((state) => state.order);
  const confetti = new JSConfetti();

  useEffect(() => {
    //만약 주문번호가 없는상태로 이페이지에 왔다면 다시 메인페이지로 돌아가기
    if(orderNum === ""){
      return (
        <Container className="confirmation-page">
          <h1>주문 실패</h1>
          <div>
            메인 페이지로 돌아가세요
          </div>
          <Link to={"/"}>메인 페이지로 돌아가기</Link>
        </Container>
      )
    }else{
      handleFire();
    }
  }, []);

  const handleFire = () => {
    confetti.addConfetti({
      emojis: ["🎉", "🥳", "🎊"],
      emojiSize: 100,
      confettiNumber: 30,
    });
  };


  return (
    <Container className="confirmation-page">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="greenCheck.png"
      />
      <h2>주문이 완료되었습니다!</h2>
      <div>주문번호:{orderNum}</div>
      <div>
        <div className="text-align-center">
          <Link to={"/account/purchase"}>내 주문 바로가기</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;

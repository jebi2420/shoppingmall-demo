import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';

const AlertModal = ({showModal, setShowModal }) => {
  const { modalMessage } = useSelector((state) => state.ui);

  const [show, setShow] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShow(true);

  return (
  <>
      <Button variant="primary" onClick={handleShow}>
      Launch demo modal
      </Button>

      <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
          {/* <Modal.Title>상품을 정말 삭제하시겠습니까?</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>상품을 정말 삭제하시겠습니까?</Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          취소
          </Button>
          <Button variant="primary" onClick={handleClose}>
          삭제하기
          </Button>
      </Modal.Footer>
      </Modal>
  </>
  );
}

export default AlertModal;
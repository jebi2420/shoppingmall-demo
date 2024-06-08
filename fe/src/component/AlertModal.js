import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { productActions } from "../action/productAction";

const AlertModal = ({showModal, setShowModal, selectedId, selectedName, setSearchQuery}) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    dispatch(productActions.deleteProduct(selectedId, setSearchQuery));
    setShowModal(false);
  }
  return (
  <>

      <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title>{selectedName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>해당 상품을 정말 삭제하시겠습니까?</Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          취소
          </Button>
          <Button variant="primary" onClick={handleDelete}>
          삭제하기
          </Button>
      </Modal.Footer>
      </Modal>
  </>
  );
}

export default AlertModal;
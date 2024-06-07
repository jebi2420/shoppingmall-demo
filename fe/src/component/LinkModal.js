import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { productActions } from "../action/productAction";

const LinkModal = ({showModal, setShowModal}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { linkModal } = useSelector((state) => state.ui);
  const [show, setShow] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShow(true);

  const handleLink = () => {
    navigate(linkModal.link)
    setShowModal(false);
    console.log(linkModal.message)
  }
  return (
  <>

      <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
          {/* <Modal.Title>{selectedName}</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>{ linkModal.message }</Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleLink}>
            확인
          </Button>
      </Modal.Footer>
      </Modal>
  </>
  );
}

export default LinkModal;
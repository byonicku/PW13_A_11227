import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeleteReview } from "../../api/apiContent";
/* eslint-disable react/prop-types */ 

const ModalDeleteReview = ({
  content,
  onClose,
}) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(content);
  const [isPending, setIsPending] = useState(false);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleShow = () => setShow(true);

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
    DeleteReview(data.id)
      .then(() => {
        setIsPending(false);
        toast.success("Review Deleted");
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setIsPending(false);
        toast.dark(err.message);
      });
  };
  
  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        <FaTrash className="mx-1 mb-1" />
      </Button>
      <Modal size="md" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Hapus Review</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitData}>
          <Modal.Body>
                <p>Apakah Anda yakin dengan sungguh-sungguh ingin menghapus review ini:</p>
                <h5><strong>{data.comment}</strong></h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <span> <FaTrash/> Hapus</span>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
export default ModalDeleteReview;

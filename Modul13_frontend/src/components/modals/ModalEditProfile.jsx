import { Modal, Button, Spinner, Form, FloatingLabel } from "react-bootstrap";
import { FaEdit, FaPencilAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InputForm from "../forms/InputFloatingForm";
import { UpdateProfile } from "../../api/apiContent";
/* eslint-disable react/prop-types */ 

const ModalEditProfil = ({
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

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);

    UpdateProfile(data)
      .then((response) => {
        setIsPending(false);
        sessionStorage.setItem("user", JSON.stringify(response.data));
        toast.success(response.message);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setIsPending(false);
        toast.dark(err.message);
      });
  };

    useEffect(() => {
      sessionStorage.getItem("user")
          ? setData(JSON.parse(sessionStorage.getItem("user")))
          : setData(null);     
    }, []);
  
  return (
    <>
      <Button variant="success" className="w-75" onClick={handleShow}>
          <FaPencilAlt />
            {' '} Edit Profil
      </Button>
      <Modal size="md" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profil</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitData}>
          <Modal.Body>
          <InputForm
            type="text"
            label="Name"
            name="name"
            value={data?.name}
            onChange={handleChange}
            placeholder="Masukkan Nama"
          />

          <InputForm
            type="text"
            label="Handle"
            name="handle"
            value={data?.handle}
            onChange={handleChange}
            placeholder="Masukkan Handle"
          />

          <InputForm
            type="email"
            label="Email"
            name="email"
            value={data?.email}
            onChange={handleChange}
            placeholder="Masukkan Email"
          />
          <FloatingLabel className="fw-bold text-light" label="Bio">
            <Form.Control
              as="textarea"
              type="text"
              name="bio"
              value={data?.bio}
              onChange={handleChange}
              placeholder="Masukkan Bio"
            />
          </FloatingLabel>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={isPending}>
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
                <span>Simpan</span>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
export default ModalEditProfil;

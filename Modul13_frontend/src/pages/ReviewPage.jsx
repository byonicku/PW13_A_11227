import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner, Stack, Button, Card, CardBody, Form, FloatingLabel} from "react-bootstrap";
import { GetContentById, GetReviewsById, CreateReview, DeleteReview } from "../api/apiContent";
import { getThumbnail } from "../api";
import { useLocation } from "react-router-dom";
import { FaVideo, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import avatar from "../assets/images/default-avatar.jpg";
import ModalDeleteReview from "../components/modals/ModalDeleteReview";

function ReviewPage() {
    const { state } = useLocation();
    const [contents, setContents] = useState();
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [user, setUser] = useState({});
    
    const createReview = (data) => {
        setIsPending(true);
        CreateReview(data)
          .then(() => {
            setIsPending(false);
            fetchReview();
            toast.success("Review Added");
          })
          .catch((err) => {
            console.log(err);
            setIsPending(false);
            toast.error(err.message);
          });
      };

    function handleChange ( event ) {
        event.preventDefault();

        if (user.id === state.content.id_user) {
            toast.error("You are not allowed to review your own content");
            return;
        }

        if (review === "") {
            toast.error("Review tidak boleh kosong!");
            return;
        }

        setReview("");
        createReview({ idContent: state.content.id, comment: review });        
    }

    const fetchReview = () => {
        setIsLoading(true);
        GetReviewsById(state.content.id)
            .then((data) => {
                setReviews(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        sessionStorage.getItem("user")
            ? setUser(JSON.parse(sessionStorage.getItem("user")))
            : setUser(null);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        GetContentById(state.content.id)
            .then((data) => {
                setContents(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [state.content.id]);

    useEffect(() => {
        setIsLoading(true);
        GetReviewsById(state.content.id)
            .then((data) => {
                setReviews(data);        
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [state.content.id]); 

  return (
        <Container className="mt-4">
            <Stack direction="horizontal" gap={3} className="mb-3">
                <h1 className="h4 fw-bold mb-0 text-nowrap">Review Video</h1>
                <hr className="border-top border-light opacity-50 w-100" />
            </Stack>
            {isLoading ? (
                <div className="text-center">
                    <Spinner
                        as="span"
                        animation="border"
                        variant="primary"
                        size="lg"
                        role="status"
                        aria-hidden="true"
                    />
                    <h6 className="mt-2 mb-0">Loading...</h6>
                </div>
            ) : contents?.id ? (
                <>
                    <Card style={{ maxHeight: '720px' }}>
                        <Row className="g-0">
                            <Col md={9}>
                                <img
                                    src={getThumbnail(contents.thumbnail)}
                                    className="card-img w-100 img-fluid object-fit-cover"
                                    style={{ maxHeight: '720px'  }}
                                    alt="..."
                                />
                            </Col>
                            <Col md={3} className="ps-3 pt-1">
                                <FaVideo size={60} className="my-3"/>
                                <h5 className="card-title text-truncate">{contents.title}</h5>
                                <p className="card-text">{contents.description}</p>
                            </Col>
                        </Row>
                    </Card>

                    <h4 className="h4 fw-bold mb-0 text-nowrap pt-5">Reviews</h4>
                    <p>Tuliskan review baru:</p>
                    <Form onSubmit={handleChange} className="pb-3">
                        <Row className="align-items-center">
                            <Col md={11}>
                                <FloatingLabel className="fw-bold text-light" label="Add New Review">
                                    <Form.Control
                                        placeholder="Add New Review"
                                        className="text-light bg-transparent border-secondary"
                                        onChange={(e) => setReview(e.target.value)}
                                    />
                                </FloatingLabel>
                            </Col>

                            <Col md={1}>
                                <Button variant="primary" type="submit">
                                    Kirim
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    {
                        reviews?.length > 0 ?
                            reviews?.map((review) => (                                
                                <Card className="mb-3 bg-transparent" key={review.id}>
                                    <Row className="align-items-center">
                                        <Col md={2} className="text-center">
                                            <img
                                                src={avatar}
                                                className="card-img w-50 img-fluid py-3 rounded-circle"
                                                alt="..."
                                            />
                                        </Col>
                                        <Col md={9}>
                                            <CardBody>
                                                <h5 className="card-title text-truncate fw-bold">@{review.user.handle}</h5>
                                                <p className="card-text">{review.comment}</p>
                                            </CardBody>
                                        </Col>
                                        {isPending && user.id === review.user.id ? (
                                            <Col md={1}>
                                                <Button variant="danger" disabled>
                                                    <Spinner
                                                    as="span"
                                                    animation="grow"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    />
                                                </Button>
                                             </Col>
                                        ) : (
                                            user.id === review.user.id && (
                                                <Col md={1}>
                                                    <ModalDeleteReview
                                                        content={review}
                                                        onClose={fetchReview}
                                                    />
                                                </Col>
                                            )
                                         )}
                                    </Row>
                                </Card>
                            ))
                        : <Alert variant="dark" className="text-center">
                            Belum ada review, ayo tambahin review!
                        </Alert>
                    }
                </>
            ) : (
                <Alert variant="dark" className="text-center">
                    Data Tidak Dapat Di Akses
                </Alert>
            )}

            
        </Container>
  )
}

export default ReviewPage
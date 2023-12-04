import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner, Stack, Card, Button, Modal} from "react-bootstrap";
import avatar from "../assets/images/hori.png";
import ModalEditProfile from "../components/modals/ModalEditProfile";
import { ShowProfile } from "../api/apiContent";


const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        sessionStorage.getItem("user")
            ? setUser(JSON.parse(sessionStorage.getItem("user")))
            : setUser(null);     
    }, []);

    function refreshProfile () {
        setIsLoading(true);

        ShowProfile(user.id)
            .then((data) => {
                setUser(data.user);
                sessionStorage.setItem("user", JSON.stringify(data.user));
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }
    
    return (
        <Container className="mt-4">
            <Stack direction="horizontal" gap={3} className="mb-3">
                <h1 className="h4 fw-bold mb-0 text-nowrap">Profil</h1>
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
            ) : user ? (
                <>
                <Card style={{ maxHeight: '720px' }}>
                    <Row>
                        <Col md={4} className="text-center">
                            <img
                                src={avatar}
                                className="img-fluid my-3 mx-3"
                                alt="User Avatar"
                            />
                        </Col>
                        <Col md={6} className="ps-4 pt-3">
                            <div className="d-flex flex-column">
                                <h1 className="card-title text-truncate">{user.name}</h1>
                                <h5 className="card-text fw-bold">@{user.handle}</h5>
                                <p className="card-text mb-1">E-mail : {user.email}</p>
                                <p className="card-text mb-1">Bio : </p>
                                <p className="card-text">{user.bio}</p>
                            </div>
                        </Col>
                        <Col md={2} className="ps-3 pt-5"> 
                            <ModalEditProfile 
                                content={user} 
                                onClose={refreshProfile} />
                        </Col>
                    </Row>
                </Card>
                </>
            ) : (
                <Alert variant="dark" className="text-center">
                    Tidak ada video untukmu saat ini ☹️
                </Alert>
            )}
        </Container>
    );
};
export default ProfilePage;

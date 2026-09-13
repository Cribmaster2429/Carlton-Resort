import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Stay from "../../components/stay/Stay";
import Statement from "../../components/statement/Statement";
import Dining from "../../components/dining/Dining";
import Experiences from "../../components/experiences/Experiences";
import Spa from "../../components/spa/Spa";
import Events from "../../components/events/Events";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";

const Home = () => (
  <>
    <Navbar overlay />
    <Header />
    <Stay />
    <Statement />
    <Dining />
    <Experiences />
    <Spa />
    <Events />
    <MailList />
    <Footer />
  </>
);

export default Home;

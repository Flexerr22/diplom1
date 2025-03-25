import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "../../App.css";
import { MenuMentor } from "../../components/MenuMentor/MenuMentor";

function MentorPage() {
  return (
    <>
      <Header />
      <main>
        <MenuMentor />
      </main>
      <Footer />
    </>
  );
}

export default MentorPage;

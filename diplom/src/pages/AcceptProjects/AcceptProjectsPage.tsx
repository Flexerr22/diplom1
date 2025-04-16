import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "../../App.css";
import { AcceptProject } from "../../components/AcceptProject/AcceptProject";

function AcceptProjectPage() {
  return (
    <>
      <Header />
      <main>
        <AcceptProject />
      </main>
      <Footer />
    </>
  );
}

export default AcceptProjectPage;

import { ComplitedProject } from "../../components/ComplitedProjects/ComplitedProjects";
import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { Info } from "../../components/Info/Info";
import Users from "../../components/Users/Users";
import "../../App.css";

function Main() {
  return (
    <>
      <Header />
      <main>
        <Users />
        <Info />
        <ComplitedProject />
      </main>
      <Footer />
    </>
  );
}

export default Main;

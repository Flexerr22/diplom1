import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "../../App.css";
import { MenuComponent } from "../../components/MenuComponents/menu-component";

function ProjectPage() {
  return (
    <>
      <Header />
      <main>
        <MenuComponent />
      </main>
      <Footer />
    </>
  );
}

export default ProjectPage;

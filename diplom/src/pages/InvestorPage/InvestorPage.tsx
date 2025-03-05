import { Footer } from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "../../App.css";
import { MenuInvestor } from "../../components/MenuInvestor/MenuInvestor";

function InvestorPage() {
  return (
    <>
      <Header />
      <main>
        <MenuInvestor />
      </main>
      <Footer />
    </>
  );
}

export default InvestorPage;

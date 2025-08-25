import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Index } from "./pages/Index";
import { NotFound } from "./pages/NotFound";
import { About } from "./pages/About";
import { VisionMission } from "./pages/VisionMission";
import { Products } from "./pages/Products";
import { LeatherProducts } from "./pages/LeatherProducts";
import { CopperProducts } from "./pages/CopperProducts";
import { ImitationJewelry } from "./pages/ImitationJewelry";
import { IndianHandicrafts } from "./pages/IndianHandicrafts";
import { SustainableProducts } from "./pages/SustainableProducts";
import { Contact } from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/products" element={<LeatherProducts />} />
          <Route path="/products/leather" element={<LeatherProducts />} />
          <Route path="/products/copper" element={<CopperProducts />} />
          <Route path="/products/imitation-jewelry" element={<ImitationJewelry />} />
          <Route path="/products/handicrafts" element={<IndianHandicrafts />} />
          <Route path="/products/sustainable" element={<SustainableProducts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

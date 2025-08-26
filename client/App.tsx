import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Index } from "./pages/Index";
import { NotFound } from "./src/app/not-found";
import { About } from "./pages/About";
import { VisionMission } from "./pages/VisionMission";
import { Products } from "./pages/Products";
import { LeatherProducts } from "./src/app/products/leather/page";
import { CopperProducts } from "./src/app/products/copper/page";
import { ImitationJewelry } from "./src/app/products/imitation-jewelry/page";
import { IndianHandicrafts } from "./src/app/products/handicrafts/page";
import { SustainableProducts } from "./src/app/products/sustainable/page";
import { Contact } from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/leather" element={<LeatherProducts />} />
          <Route path="/products/copper" element={<CopperProducts />} />
          <Route
            path="/products/imitation-jewelry"
            element={<ImitationJewelry />}
          />
          <Route path="/products/handicrafts" element={<IndianHandicrafts />} />
          <Route
            path="/products/sustainable"
            element={<SustainableProducts />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

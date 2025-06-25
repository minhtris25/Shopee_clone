
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/productlist';
import Slider from '../components/Slider';
import CategoryList from '../components/CategoryList';

const Home = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Slider />
        <CategoryList />
        <ProductList />
      </main>
      <Footer />
    </div>
    </div>
  )
}

export default Home
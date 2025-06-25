import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/productlist';

const Home = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ProductList />
      </main>
      <Footer />
    </div>
    </div>
  )
}

export default Home

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Listing from './pages/Listing';
import ProductPage from './pages/Product';
import { CoupleEdit, CoupleDetail } from './pages/Couples';
import { Occasions, World } from './pages/Occasions';
import Search from './pages/Search';
import MenCatalog, { MenLookDetail } from './pages/MenCatalog';
import Saved from './pages/Saved';
import TryOn from './pages/TryOn';
import { Journal, Article, About, Contact, FAQ, Privacy, Terms, AffiliateDisclosure, TryOnPrivacy, NotFound } from './pages/Static';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="women" element={<Listing mode="gender" fixedGender="women" key="w" />} />
          <Route path="men" element={<MenCatalog />} />
          <Route path="men/:category" element={<MenCatalog />} />
          <Route path="men-look/:id" element={<MenLookDetail />} />
          <Route path=":gender/:category" element={<Listing mode="gender" />} />
          <Route path="trending" element={<Listing mode="trending" />} />
          <Route path="accessories" element={<Listing mode="accessories" />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="occasions" element={<Occasions />} />
          <Route path="occasions/:world" element={<World />} />
          <Route path="couple-edit" element={<CoupleEdit />} />
          <Route path="couple-edit/:id" element={<CoupleDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="saved" element={<Saved />} />
          <Route path="try-on" element={<TryOn />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<Article />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="affiliate-disclosure" element={<AffiliateDisclosure />} />
          <Route path="ai-try-on-privacy" element={<TryOnPrivacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

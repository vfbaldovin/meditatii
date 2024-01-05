import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { HomeCta } from 'src/sections/home/home-cta';
import { HomeFaqs } from 'src/sections/home/home-faqs';
import { HomeFeatures } from 'src/sections/home/home-features';
import { HomeHero } from 'src/sections/home/home-hero';
import { HomeReviews } from 'src/sections/home/home-reviews';
import { useSelector } from 'react-redux';

const Page = () => {
  usePageView();
  const currentPage = useSelector((state) => state.home.currentPage);
  const totalItems = useSelector((state) => state.home.totalItems);

  return (
    <>
      <Seo />
      <main>
        <HomeHero />
        {/*<HomeFeatures />*/}
        {/*<HomeReviews />*/}
        {/*<HomeCta />*/}
        {/*<HomeFaqs />*/}
      </main>
    </>
  );
};

export default Page;

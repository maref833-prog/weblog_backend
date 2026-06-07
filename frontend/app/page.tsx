import FeaturedPosts from "@/components/FeaturedPosts";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import LandingPage from "@/components/Landing";
import MusicPlaylist from "@/components/MusicPlaylist";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 ">
      <LandingPage/>
      <Intro/>
      <FeaturedPosts/>
      <MusicPlaylist/>
      <Footer/>
    </div>
  );
}

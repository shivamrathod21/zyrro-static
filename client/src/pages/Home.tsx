import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import BeforeAfter from "@/components/BeforeAfter";
import Portfolio from "@/components/Portfolio";
import Creators from "@/components/Creators";
import Testimonials from "@/components/Testimonials";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <BeforeAfter />
        <Portfolio />
        <Creators />
        <Testimonials />
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
}

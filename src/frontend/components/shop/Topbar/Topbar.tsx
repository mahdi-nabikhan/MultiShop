"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from "framer-motion";

import "./Topbar.css";

const slides = [
  {
    image: "/images/banner-1.jpg",
  },
  {
    image: "/images/banner-2.jpg",
  },
  {
    image: "/images/banner-3.jpg",
  },
];

export default function Topbar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">

      {/* Image */}

      <AnimatePresence mode="wait">

        <motion.div
          key={index}
          className="hero-image"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .8 }}
        >
          <img src={slides[index].image} alt="" />
        </motion.div>

      </AnimatePresence>

      {/* Text */}

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: .7 }}
      >
        <TypeAnimation
          key={index}
          sequence={[
            "Discover Premium Products",
            1500,

            "Summer Collection 2026",
            1500,

            "Fast Delivery Everywhere",
            1500,
          ]}
          speed={45}
          wrapper="h1"
          cursor={true}
          repeat={0}
        />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .4 }}
        >
          Shop from thousands of trusted sellers with secure
          payment and fast delivery.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: .95 }}
        >
          Shop Now
        </motion.button>

      </motion.div>

    </section>
  );
}
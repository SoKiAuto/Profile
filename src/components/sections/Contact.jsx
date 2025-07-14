import { useState } from "react";
import { RevealOnScroll } from "../RevealOnScroll";

export const Contact = () => {
  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center py-20 bg-transparent"
    >
      <RevealOnScroll>
        <div className="w-full px-4 sm:w-2/3 md:w-[500px] p-6">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent text-center">
            Contact Me
          </h2>

          <div className="space-y-6">
            <div className="text-white">
              <p>
                <strong>Phone:</strong> +918200594008
              </p>
              <p>
                <strong>Email:</strong> solankikishan149@gmail.com
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/solankikishan149" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  SolankiKishan
                </a>
              </p>
            </div>

            <p className="text-white mt-6">
            Your next big idea could be just a message away. 
            Let’s connect through any of the options above and see what we can create together!
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};

import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-5xl font-bold mb-4">
              Uncovering Insights from <span className="text-yellow-500">TUPT Programs</span>
            </h1>
            <p className="mb-6">
              A comprehensive look at how sentiment analysis can illuminate the opinions and feedback of members regarding organizational programs at the Technological University of the Philippines – Taguig.
            </p>
            <button className="bg-yellow-500 text-black py-2 px-4 rounded-lg mb-4 md:mb-0">Learn More</button>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a href="#" className="text-white">Read Our Study</a>
              <a href="#" className="text-white">Contact Us</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative">
              <img src="https://via.placeholder.com/400" alt="Analysis and Research" className="rounded-lg" />
              <div className="absolute bottom-4 right-4 bg-yellow-500 p-2 rounded-full">
                <span className="text-black">▶</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Focus Section */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Our Research Focus</h2>
          <p className="text-center mb-12">
            Our thesis delves into sentiment analysis to gauge member feedback on TUPT's organization programs, providing valuable insights for program enhancement and member satisfaction.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['Sentiment Analysis', 'Behavioral Insights', 'Feedback Compilation', 'Impact Assessment'].map((focus, index) => (
              <div key={index} className="text-center">
                <div className="bg-yellow-500 p-4 inline-block mb-4 rounded-full">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-semibold">{focus}</h3>
                <p className="mt-2">Key findings and methodologies related to the analysis of member opinions.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Project Section */}
      <section className="py-16 px-8 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Recent Findings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Sentiment Breakdown', 'Behavioral Trends', 'Engagement Metrics'].map((finding, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150" alt={finding} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-2xl font-semibold">{finding}</h3>
                <p className="mt-2">An overview of what we discovered from analyzing member feedback.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Concluding Insights</h2>
          <p className="text-lg mb-4">
            Our research aims to assist the Technological University of the Philippines – Taguig in better understanding member opinions, facilitating data-driven improvements for future organizational programs.
          </p>
          <div className="space-y-4">
            {['Key Takeaway 1', 'Key Takeaway 2', 'Key Takeaway 3'].map((takeaway, index) => (
              <div key={index} className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                <span className="text-xl">{takeaway}</span>
                <span className="text-yellow-500">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Post Section */}
      <section className="py-16 px-8 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Our Latest Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Update 1', 'Update 2', 'Update 3'].map((post, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150" alt={`Post ${index + 1}`} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-2xl font-semibold">Sentiment Insights</h3>
                <p className="text-sm mt-2">Latest findings from our ongoing analysis of TUPT member feedback.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>© 2024 Technological University of the Philippines – Taguig. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

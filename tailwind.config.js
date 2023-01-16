/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        120: "30rem",
        122: "34rem",
        124: "38rem",
        126: "42rem",
      },
      backgroundImage: {
        "homepage-logged-out-image":
          "url('https://firebasestorage.googleapis.com/v0/b/healthcare-f57e8.appspot.com/o/medthread_homepage_background.jpeg?alt=media&token=d80953b1-598f-4029-8bc3-f9ce8ab8ee40')",
        "footer-texture": "url('/img/footer-texture.png')",
      },
    },
  },
  plugins: [],
};

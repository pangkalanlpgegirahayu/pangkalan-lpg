/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Poppins"'],
      },
      
      backgroundImage: theme => ({
        'gradient-to-45': 
            'linear-gradient(135deg, #fff, #9ccba2)',
        'gradient-to-135': 
            'linear-gradient(135deg, #ffed4a, #ff3860)',
        // You can add more custom classes here
      })
    },
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: ['light']
  }
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      // Colors
      // Yellow
      'yellow': '#fcbe00', // Amber
      'yellow-darker': '#FFCC30',

      // Blue
      'blue': '#003768', // Yale blue

      // Red
      'red': '#EE2E24',

      // Application colors
      // Blue
      'primary': '#3B8EA5',
      'dark-primary': '#337d91',

      // Green
      'success': '#32965D',
      'dark-success': '#2d8754',
      
      //Red
      'error': '#A41623',

      // Shades
      'true-white': '#ffffff',
      'white': '#fcfcfc',
      'gray': '#d9d9d9',
      'darker-gray': '#787777',
      'dark-gray': '#b1b2b5',
      'true-black': '#000000',
      'black': '#2D2D2D',
    },
  },
  plugins: [],
}


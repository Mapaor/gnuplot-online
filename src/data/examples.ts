export interface GnuplotExample {
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
  thumbnail?: string;
}

export const gnuplotExamples: GnuplotExample[] = [
  {
    id: 'basic-sine',
    title: 'Basic Sine Wave',
    description: 'A simple sine wave plot demonstrating basic function plotting',
    category: 'Basic Functions',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Sine Wave"
set xlabel "x"
set ylabel "sin(x)"
set grid
plot sin(x) with lines title "sin(x)"`
  },
  {
    id: 'polynomial',
    title: 'Polynomial Functions',
    description: 'Multiple polynomial functions on the same plot',
    category: 'Basic Functions',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Polynomial Functions"
set xlabel "x"
set ylabel "y"
set grid
set xrange [-3:3]
plot x**2 title "x²", x**3 title "x³", x**4/4 title "x⁴/4"`
  },
  {
    id: 'data-points',
    title: 'Data Points with Lines',
    description: 'Plotting discrete data points with connecting lines',
    category: 'Data Visualization',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Sample Data"
set xlabel "Time"
set ylabel "Value"
set grid
set style data linespoints
plot '-' with linespoints title "Data Series"
1 2.5
2 4.1
3 3.8
4 5.2
5 6.1
6 5.8
7 7.2
8 8.1
e`
  },
  {
    id: 'parametric',
    title: 'Parametric Circle',
    description: 'A parametric plot creating a perfect circle',
    category: 'Parametric',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Parametric Circle"
set parametric
set trange [0:2*pi]
set size square
set grid
plot cos(t), sin(t) title "Circle"`
  },
  {
    id: 'spiral',
    title: 'Archimedean Spiral',
    description: 'A beautiful spiral using parametric equations',
    category: 'Parametric',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Archimedean Spiral"
set parametric
set trange [0:10*pi]
set grid
plot t*cos(t), t*sin(t) title "Spiral"`
  },
  {
    id: 'trigonometric',
    title: 'Trigonometric Functions',
    description: 'Common trigonometric functions comparison',
    category: 'Mathematical',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Trigonometric Functions"
set xlabel "x (radians)"
set ylabel "y"
set grid
set xrange [0:4*pi]
plot sin(x) title "sin(x)", cos(x) title "cos(x)", tan(x) title "tan(x)"`
  },
  {
    id: 'exponential',
    title: 'Exponential and Logarithmic',
    description: 'Exponential growth and logarithmic functions',
    category: 'Mathematical',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Exponential and Logarithmic Functions"
set xlabel "x"
set ylabel "y"
set grid
set xrange [0.1:5]
plot exp(x) title "e^x", log(x) title "ln(x)", x title "x"`
  },
  {
    id: 'statistics',
    title: 'Normal Distribution',
    description: 'Gaussian/Normal distribution curve',
    category: 'Statistics',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Normal Distribution"
set xlabel "x"
set ylabel "Probability Density"
set grid
set xrange [-4:4]
set samples 1000
normal(x,mu,sigma) = (1/(sigma*sqrt(2*pi))) * exp(-0.5*((x-mu)/sigma)**2)
plot normal(x,0,1) title "μ=0, σ=1", normal(x,0,0.5) title "μ=0, σ=0.5", normal(x,1,1) title "μ=1, σ=1"`
  },
  {
    id: 'bar-chart',
    title: 'Bar Chart',
    description: 'Simple bar chart with discrete data',
    category: 'Charts',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Sample Bar Chart"
set xlabel "Categories"
set ylabel "Values"
set style data histogram
set style histogram cluster gap 1
set style fill solid border -1
set boxwidth 0.9
set grid y
plot '-' using 2:xtic(1) title "Data"
"Category A" 23
"Category B" 45
"Category C" 56
"Category D" 78
"Category E" 32
e`
  },
  {
    id: 'surface-3d',
    title: '3D Surface Plot',
    description: 'Three-dimensional surface visualization',
    category: '3D Plots',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "3D Surface Plot"
set xlabel "X axis"
set ylabel "Y axis"
set zlabel "Z axis"
set grid
splot x**2 + y**2 title "z = x² + y²"`
  }
];

export const categories = Array.from(new Set(gnuplotExamples.map(ex => ex.category)));

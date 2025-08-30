export interface GnuplotExample {
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
  data?: string;
  thumbnail?: string;
}

export const gnuplotExamples: GnuplotExample[] = [
  {
    id: 'basic-sine',
    title: 'Funció sin(x)',
    description: 'Un gràfic senzill d\'una ona sinusoidal que mostra la representació de funcions bàsiques',
    category: 'Funcions bàsiques',
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
    title: 'Funcions Polinomials',
    description: 'Diverses funcions polinomials en el mateix gràfic',
    category: 'Funcions bàsiques',
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
    title: 'Punts de Dades amb Línies',
    description: 'Representació de punts de dades discrets amb línies de connexió',
    category: 'Visualització de dades',
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
    title: 'Cercle Paramètric',
    description: 'Un gràfic paramètric que genera un cercle perfecte',
    category: 'Paramètric',
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
    title: 'Espiral d\'Arquimedes',
    description: 'Una espiral atractiva utilitzant equacions paramètriques',
    category: 'Paramètric',
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
    title: 'Funcions Trigonomètriques',
    description: 'Comparació de funcions trigonomètriques comunes',
    category: 'Matemàtiques',
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
    title: 'Exponencial i Logarítmica',
    description: 'Creixement exponencial i funcions logarítmiques',
    category: 'Matemàtiques',
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
    title: 'Distribució Normal',
    description: 'Corba de distribució normal o gaussiana',
    category: 'Estadística',
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
    title: 'Diagrama de Barres',
    description: 'Diagrama de barres senzill amb dades discretes',
    category: 'Diagrames',
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
    title: 'Gràfic de Superfície 3D',
    description: 'Visualització tridimensional de superfícies',
    category: 'Gràfics 3D',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "3D Surface Plot"
set xlabel "X axis"
set ylabel "Y axis"
set zlabel "Z axis"
set grid
splot x**2 + y**2 title "z = x² + y²"`
  },
  {
    id: 'data-file-basic',
    title: 'Gràfic de dades externes',
    description: 'Un gràfic que utilitza dades des de la pestanya de dades',
    category: 'Dades externes',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Gràfic de dades externes"
set xlabel "Columna 1"
set ylabel "Columna 2"
set grid
# Utilitza les dades del fitxer "data.dat"
plot "data.dat" using 1:2 with linespoints title "Dades",\\
     "data.dat" using 1:3 with linespoints title "Més dades"`,
    data: `# Dades d'exemple per al gràfic
# X Y Z
1 10 5
2 15 8
3 12 9
4 20 15
5 18 12
6 25 20
7 22 18
8 30 25
9 28 22
10 35 30`
  },
  {
    id: 'data-file-scatter',
    title: 'Diagrama de dispersió',
    description: 'Visualitza dades com a punts en un diagrama de dispersió',
    category: 'Dades externes',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Diagrama de dispersió"
set xlabel "Valor X"
set ylabel "Valor Y"
set grid
set style fill transparent solid 0.5
# Utilitza les dades però sense línies
plot "data.dat" using 1:2 with points pt 7 ps 1.5 title "Grup A",\\
     "data.dat" using 1:3 with points pt 9 ps 1.5 title "Grup B"`,
    data: `# Dades per al diagrama de dispersió
# X Y1 Y2
1.2 8.3 4.2
2.5 10.1 5.5
3.1 9.5 7.2
4.7 12.3 8.1
5.3 11.0 6.5
6.8 14.5 9.8
7.2 13.8 10.2
8.5 16.2 12.5
9.1 15.5 11.8
10.4 18.2 14.2`
  },
  {
    id: 'data-file-heatmap',
    title: 'Mapa de calor (Heatmap)',
    description: 'Visualitza una matriu de dades com un mapa de calor',
    category: 'Dades externes',
    code: `set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Mapa de calor"
set xlabel "Eix X"
set ylabel "Eix Y"
unset key
set view map
set palette defined (0 "blue", 10 "green", 20 "yellow", 30 "red")
set cblabel "Valor"
set dgrid3d 30,30,2
splot "data.dat" using 1:2:3 with pm3d`,
    data: `# Dades per al mapa de calor
# X Y Z (valor)
1 1 5
1 2 8
1 3 12
1 4 15
1 5 10
2 1 7
2 2 14
2 3 20
2 4 18
2 5 12
3 1 10
3 2 18
3 3 25
3 4 22
3 5 15
4 1 8
4 2 15
4 3 22
4 4 28
4 5 20
5 1 6
5 2 12
5 3 18
5 4 15
5 5 10`
  }
];

export const categories = Array.from(new Set(gnuplotExamples.map(ex => ex.category)));

# 🚀 Gnuplot Web Compiler

A modern web-based Gnuplot compiler and visualization tool built with Next.js, React, TypeScript, and WebAssembly. Create beautiful plots and charts directly in your browser without any local installation.

![Gnuplot Web Compiler](https://img.shields.io/badge/Gnuplot-WebAssembly-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)

## ✨ Features

### 🎨 **Rich Example Gallery**
- **10+ Pre-built Examples**: From basic sine waves to complex 3D surface plots
- **Multiple Categories**: Basic Functions, Data Visualization, Parametric, Mathematical, Statistics, Charts, and 3D Plots
- **One-Click Loading**: Load any example with a single click
- **Smart Filtering**: Filter examples by category

### 🔧 **Advanced Editor**
- **Syntax Highlighting**: Dedicated Gnuplot script editor
- **Real-time Feedback**: Instant error reporting and debug information
- **Auto-completion**: Smart suggestions for Gnuplot commands
- **Example Integration**: Seamlessly load and modify examples

### 📊 **Powerful Visualization**
- **SVG Output**: High-quality, scalable vector graphics
- **Real-time Rendering**: Instant plot generation
- **Interactive Preview**: Zoom, pan, and explore your plots
- **Export Ready**: SVG format suitable for presentations and publications

### 🚀 **Modern Web Technologies**
- **WebAssembly**: Native Gnuplot performance in the browser
- **No Installation**: Works entirely in your browser
- **Responsive Design**: Beautiful UI that works on all devices
- **Fast Loading**: Optimized for quick startup and execution

## 🎯 Example Categories

### 📈 Basic Functions
- **Sine Wave**: Classic trigonometric function plotting
- **Polynomial Functions**: Multiple polynomial overlays
- **Trigonometric Comparison**: Sin, cos, and tan functions

### 📊 Data Visualization  
- **Data Points with Lines**: Discrete data visualization
- **Bar Charts**: Categorical data representation
- **Statistical Plots**: Data analysis visualizations

### 🌀 Parametric Plots
- **Parametric Circle**: Perfect geometric shapes
- **Archimedean Spiral**: Beautiful mathematical spirals
- **Complex Curves**: Advanced parametric equations

### 🧮 Mathematical Functions
- **Exponential & Logarithmic**: Growth and decay functions
- **Normal Distribution**: Statistical distributions
- **Complex Analysis**: Advanced mathematical visualization

### 🔮 3D Visualizations
- **Surface Plots**: Three-dimensional data representation
- **Contour Maps**: Topological visualizations
- **3D Parametric**: Complex three-dimensional curves

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15.5.2 with App Router
- **UI Library**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Plotting Engine**: Gnuplot via WebAssembly (gnuplot-wasm)
- **Module Loading**: Dynamic ES6 imports with fallback strategies
- **Build Tools**: Modern JavaScript toolchain with ESLint

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gnuplot-compiler.git
   cd gnuplot-compiler
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📝 Usage Guide

### 🎯 Quick Start
1. **Load an Example**: Click "Show Examples" and choose from the gallery
2. **Edit the Script**: Modify the Gnuplot code in the editor
3. **Generate Plot**: Click "Run Plot" to create your visualization
4. **Debug**: Monitor the debug console for detailed execution information

### 💡 Writing Gnuplot Scripts

For best results, structure your scripts like this:

```gnuplot
set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title "Your Plot Title"
set xlabel "X Axis Label"
set ylabel "Y Axis Label"
set grid
plot sin(x) title "sin(x)", cos(x) title "cos(x)"
```

### 🔧 Advanced Features

- **File System**: Use Gnuplot's virtual file system for complex data
- **Multiple Plots**: Create multiple plots in a single script
- **Data Import**: Load data from inline sources
- **Custom Styling**: Full control over colors, fonts, and styling

## 🏗️ Project Structure

```
gnuplot-compiler/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── components/         # React components
│   │   │   ├── EnhancedGnuplotDemo.tsx  # Main demo component
│   │   │   └── GnuplotDemo.tsx          # Original demo component
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # App layout
│   │   └── page.tsx           # Home page
│   ├── data/
│   │   └── examples.ts        # Gnuplot example definitions
│   ├── lib/
│   │   └── gnuplot-loader.ts  # WebAssembly module loader
│   └── gnuplot-wasm.d.ts      # TypeScript type definitions
├── public/
│   ├── gnuplot.js             # Gnuplot WebAssembly module
│   └── gnuplot.wasm           # WebAssembly binary
└── [config files]
```

## 🔧 Technical Implementation

### WebAssembly Integration
- **Dynamic Loading**: ES6 dynamic imports with script tag fallback
- **Error Handling**: Comprehensive error handling and recovery
- **Module Configuration**: Custom locateFile and I/O handlers
- **Performance**: Optimized for fast loading and execution

### React Architecture
- **Hooks**: Modern React patterns with useState and useEffect
- **TypeScript**: Full type safety throughout the application
- **Component Design**: Modular, reusable component architecture
- **State Management**: Efficient state management for UI and data

### Styling & UX
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first, responsive layout
- **Dark Theme**: Debug console with terminal-style appearance
- **Animations**: Smooth transitions and loading states

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Gnuplot Team**: For the amazing plotting software
- **Emscripten**: For making WebAssembly compilation possible
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the beautiful styling system

## 📞 Support

- **Documentation**: [Gnuplot Official Docs](http://gnuplot.info/documentation.html)
- **Issues**: [GitHub Issues](https://github.com/yourusername/gnuplot-compiler/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gnuplot-compiler/discussions)

---

<div align="center">

**🌟 Star this project if you find it useful! 🌟**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/gnuplot-compiler?style=social)](https://github.com/yourusername/gnuplot-compiler/stargazers)

</div>

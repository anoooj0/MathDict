# 📐 Math Voice Notes

A web-based voice dictation app that allows you to write mathematical notes by speaking. Converts spoken math terms into LaTeX format with live preview and graphing capabilities.

## Features

- **Voice Dictation**: Speak mathematical expressions naturally
- **LaTeX Conversion**: Automatic conversion from speech to LaTeX
- **Live Preview**: See rendered math equations in real-time using KaTeX
- **Graph Plotting**: Create graphs by voice commands
- **Note Saving**: Save and manage multiple notes locally
- **Edit Anytime**: Manually edit LaTeX code directly

## Getting Started

### Prerequisites

- Modern web browser (Chrome or Edge recommended for best speech recognition)
- No installation required - runs entirely in the browser

### Usage

1. Open `index.html` in your web browser
2. Click "🎤 Start Dictation" to begin voice input
3. Speak mathematical expressions naturally
4. Watch as your speech converts to LaTeX and renders in the preview
5. Click "💾 Save Note" to store your work

## Voice Commands

### Basic Math

- **Powers**: "x squared" → x²
- **Roots**: "square root of x" → √x
- **Fractions**: "x over 2" or "fraction numerator x over denominator 2" → x/2

### Calculus

- "integral of x dx" → ∫x dx
- "integral from 0 to pi of sine x dx" → ∫₀^π sin(x) dx
- "derivative of x squared" → d/dx x²
- "limit", "sum", "product"

### Greek Letters

Just say the name: "alpha", "beta", "gamma", "delta", "theta", "pi", "sigma", "omega", etc.

### Trigonometry

"sine", "cosine", "tangent" → sin, cos, tan

### Operators

- "plus" → +
- "minus" → -
- "times" → ×
- "equals" → =
- "less than or equal" → ≤
- "infinity" → ∞

### Graphing

- "plot y equals x squared" → generates parabola
- "graph sine x" → generates sine wave

## File Structure

```
math-voice-notes/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── app.js          # JavaScript logic (speech recognition, LaTeX conversion)
└── README.md       # Documentation
```

## Technologies Used

- **Web Speech API**: Browser-native speech recognition
- **KaTeX**: Fast math rendering library
- **function-plot**: Mathematical graphing library
- **LocalStorage**: Client-side note persistence

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Edge (recommended)
- ⚠️ Safari (limited speech recognition support)
- ⚠️ Firefox (limited speech recognition support)

## Limitations

- Requires microphone access
- Internet connection needed for CDN resources (KaTeX, function-plot)
- Speech recognition accuracy depends on pronunciation and audio quality
- Complex nested expressions may require manual editing

## Tips for Best Results

1. Speak clearly and at a moderate pace
2. Use pauses between distinct mathematical expressions
3. For complex expressions, break them into smaller parts
4. Review and manually edit LaTeX if needed
5. Use the help guide in the app for command reference

## Future Enhancements

- Export to PDF
- Cloud sync
- More graph types (3D plots, parametric equations)
- Math symbol keyboard shortcuts
- Collaborative editing
- Custom vocabulary training

## License

Free to use and modify for personal and educational purposes.

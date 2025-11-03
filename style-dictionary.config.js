/**
 * Style Dictionary Configuration
 *
 * Transforms design tokens extracted from the Brand Guidelines wiki
 * into platform-specific formats (CSS variables, Tailwind config).
 *
 * @see https://amzn.github.io/style-dictionary/
 */

export default {
  // Source design token files (extracted from Brand Guidelines wiki)
  source: ['src/styles/tokens/design-tokens.json'],

  // Platform outputs
  platforms: {
    // CSS Custom Properties (:root variables)
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'design-tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true, // Preserve token relationships (e.g., color.primary references color.base)
            showFileHeader: true,
          },
        },
      ],
    },

    // Tailwind CSS Configuration (JavaScript module)
    tailwind: {
      transformGroup: 'js',
      buildPath: './',
      files: [
        {
          destination: 'tailwind.tokens.js',
          format: 'javascript/module-flat',
          options: {
            outputReferences: false, // Flatten values for Tailwind
            showFileHeader: true,
          },
        },
      ],
    },

    // SCSS Variables (optional, for future use)
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'design-tokens.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true,
            showFileHeader: true,
          },
        },
      ],
    },
  },
};

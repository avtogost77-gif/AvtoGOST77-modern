// ============================================
// POSTCSS КОНФИГУРАЦИЯ - AvtoGOST77
// ============================================
// Дата создания: 31 августа 2025
// Автор: AI Assistant
// Описание: Конфигурация PostCSS для оптимизации CSS

module.exports = {
  plugins: [
    // Автопрефиксы для кроссбраузерности
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ],
      flexbox: 'no-2009',
      grid: 'autoplace'
    }),
    
    // Минификация CSS
    require('cssnano')({
      preset: [
        'default',
        {
          // Настройки минификации
          discardComments: {
            removeAll: true,
          },
          discardUnused: true,
          mergeIdents: false,
          reduceIdents: false,
          zindex: false,
          // Сохраняем важные комментарии
          discardComments: {
            removeAll: false,
            remove: (comment) => {
              return comment.indexOf('!') === 0;
            }
          }
        }
      ]
    }),
    
    // Современные CSS возможности
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'custom-properties': true,
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
        'logical-properties-and-values': true,
        'overflow-property': true,
        'place-properties': true,
        'is-pseudo-class': true,
        'focus-visible-pseudo-class': true,
        'focus-within-pseudo-class': true,
        'color-functional-notation': true,
        'double-position-gradients': true,
        'lab-function': true,
        'hwb-function': true,
        'space-separated-values': true,
        'text-decoration-shorthand': true,
        'text-underline-offset': true,
        'text-decoration-thickness': true,
        'font-format-keywords': true,
        'progressive-custom-properties': true,
        'blank-pseudo-class': true,
        'has-pseudo-class': true,
        'prefers-color-scheme-query': true,
        'gap-properties': true,
        'custom-selectors': true,
        'case-insensitive-attributes': true,
        'rebeccapurple-color': true,
        'hexadecimal-alpha-notation': true,
        'color-mix': true,
        'cascade-layers': true,
        'clamp': true,
        'logical-properties-and-values': true,
        'overflow-property': true,
        'place-properties': true,
        'is-pseudo-class': true,
        'focus-visible-pseudo-class': true,
        'focus-within-pseudo-class': true,
        'color-functional-notation': true,
        'double-position-gradients': true,
        'lab-function': true,
        'hwb-function': true,
        'space-separated-values': true,
        'text-decoration-shorthand': true,
        'text-underline-offset': true,
        'text-decoration-thickness': true,
        'font-format-keywords': true,
        'progressive-custom-properties': true,
        'blank-pseudo-class': true,
        'has-pseudo-class': true,
        'prefers-color-scheme-query': true,
        'gap-properties': true,
        'custom-selectors': true,
        'case-insensitive-attributes': true,
        'rebeccapurple-color': true,
        'hexadecimal-alpha-notation': true,
        'color-mix': true,
        'cascade-layers': true,
        'clamp': true
      }
    })
  ]
};

# Product Actions - Skin Tone Color Palette

This module enhances the product variant selection with a specialized skin tone color palette when products have skin tone-related variants.

## Features

### 🎨 Skin Tone Color Palette
- **Automatic Detection**: Automatically detects when a product option is related to skin tone selection
- **Visual Color Grid**: Displays skin tones as colored circles with hover effects
- **Comprehensive Options**: Includes 100+ skin tone options from various classification systems:
  - Fitzpatrick Scale (Type I-VI)
  - Von Luschan Scale
  - Regional variations (Nordic, Celtic, Mediterranean, Asian, African, etc.)
  - Foundation industry standards
  - Undertone variations (warm, cool, neutral, olive)

### 👤 Personalized Experience
- **Profile Integration**: Uses customer's skin tone from their profile
- **Quick Selection**: "Use my tone" button for instant selection
- **Visual Indicators**: 
  - Blue ring for selected tone
  - Green ring for customer's profile tone
- **Smart Recommendations**: Shows personalized recommendations based on profile

### 🔍 Advanced Filtering
- **Category Filters**: All, Fitzpatrick, Regional, Foundation
- **Show More/Less**: Paginated display for better UX
- **Search Optimization**: Efficient filtering and display

## How It Works

### Detection Logic
The system automatically detects skin tone options by checking:
1. **Option Title**: Contains keywords like 'skin', 'tone', 'color', 'shade', 'complexion'
2. **Option Values**: Contains skin tone-related terms like 'fair', 'medium', 'dark', 'warm', 'cool', etc.

### Component Structure
```
OptionSelect
├── SkinToneSelector (for skin tone options)
│   ├── Filter tabs
│   ├── Color grid
│   ├── Quick selection
│   └── Recommendations
└── Default selector (for other options)
```

## Usage

### For Products with Skin Tone Variants
When a product has skin tone variants, the system automatically:
1. Detects the skin tone option
2. Switches to the specialized `SkinToneSelector`
3. Shows the color palette with all available skin tones
4. Provides personalized recommendations

### For Regular Products
Regular product options continue to use the standard button-based selector.

## Customer Experience

### With Profile Set
- Sees their skin tone highlighted with a green indicator
- Can quickly select their tone with one click
- Gets personalized recommendations
- Sees helpful information about their selection

### Without Profile Set
- Sees all available skin tone options
- Gets prompted to set their skin tone for better experience
- Can still browse and select any skin tone
- Receives helpful guidance

## Technical Implementation

### Files Modified
- `option-select.tsx`: Enhanced to detect and route to skin tone selector
- `skin-tone-selector.tsx`: New specialized component for skin tone selection
- `skin-tone-analyzer.ts`: Comprehensive skin tone database and utilities

### Key Features
- **TypeScript**: Fully typed for better development experience
- **Responsive**: Works on mobile and desktop
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Performance**: Efficient rendering and state management
- **Integration**: Seamlessly integrates with existing Medusa/Next.js architecture

## Benefits

1. **Enhanced UX**: Visual color selection instead of text-only options
2. **Personalization**: Leverages customer profile data
3. **Comprehensive**: Covers diverse skin tone classifications
4. **Accessible**: Inclusive design for all skin tones
5. **Scalable**: Easy to add new skin tone options
6. **Maintainable**: Clean, modular code structure

## Future Enhancements

- AI-powered skin tone matching
- Camera-based skin tone detection
- Integration with makeup/fashion recommendations
- Advanced filtering by undertone, region, etc.
- Social features (reviews by skin tone) 
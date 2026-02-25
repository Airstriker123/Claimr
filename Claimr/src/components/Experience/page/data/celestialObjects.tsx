export interface CelestialObject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  facts: {
    title: string;
    content: string;
  }[];
  stats: {
    label: string;
    value: string;
  }[];
  videoUrl?: string;
}

export const celestialObjects: CelestialObject[] = [
    {
    id: 'earth',
    name: 'Earth',
    tagline: 'The Blue Marble',
    description: 'Our home planet, a unique oasis of life in the vast cosmos. Earth is the only known planet to harbor life, with vast oceans covering 71% of its surface and a protective atmosphere that shields us from harmful solar radiation.',
    facts: [
      {
        title: 'Formation',
        content: 'Earth formed approximately 4.54 billion years ago from the accretion of dust and gas in the early solar system. Over millions of years, gravity pulled together matter to create our planet.',
      },
      {
        title: 'Atmosphere',
        content: 'Earth\'s atmosphere is composed of 78% nitrogen, 21% oxygen, and trace amounts of other gases. This unique composition supports life and protects us from meteorites and harmful solar radiation.',
      },
      {
        title: 'Life',
        content: 'Earth is the only known planet to support life. From microscopic bacteria to massive blue whales, our planet hosts an incredible diversity of organisms adapted to every environment.',
      },
    ],
    stats: [
      { label: 'Mass', value: '5.972 × 10²⁴ kg' },
      { label: 'Diameter', value: '12,742 km' },
      { label: 'Distance from Sun', value: '149.6 million km' },
      { label: 'Orbital Period', value: '365.25 days' },
      { label: 'Surface Gravity', value: '9.807 m/s²' },
      { label: 'Moons', value: '1 (Luna)' },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    tagline: 'The Gas Giant',
    description: 'Jupiter is the largest planet in our solar system, a massive gas giant with a powerful magnetic field and the iconic Great Red Spot - a storm larger than Earth that has raged for centuries.',
    facts: [
      {
        title: 'The Great Red Spot',
        content: 'Jupiter\'s most famous feature is a giant anticyclonic storm that has been raging for at least 400 years. The Great Red Spot is so large that three Earths could fit inside it.',
      },
      {
        title: 'Composition',
        content: 'Jupiter is primarily composed of hydrogen and helium, similar to the Sun. It has no solid surface - the atmosphere gradually transitions into liquid and then metallic hydrogen deep within.',
      },
      {
        title: 'Magnetic Field',
        content: 'Jupiter has the strongest magnetic field of any planet in our solar system, about 20,000 times stronger than Earth\'s. This field creates intense radiation belts and spectacular auroras.',
      },
    ],
    stats: [
      { label: 'Mass', value: '1.898 × 10²⁷ kg' },
      { label: 'Diameter', value: '139,820 km' },
      { label: 'Distance from Sun', value: '778.5 million km' },
      { label: 'Orbital Period', value: '11.86 years' },
      { label: 'Day Length', value: '9.93 hours' },
      { label: 'Moons', value: '95 confirmed' },
    ],
  },
  {
    id: 'stars',
    name: 'Stars',
    tagline: 'Cosmic Furnaces',
    description: 'Stars are massive, luminous spheres of plasma held together by gravity. They generate energy through nuclear fusion, converting hydrogen into helium and releasing tremendous amounts of light and heat.',
    facts: [
      {
        title: 'Nuclear Fusion',
        content: 'Stars shine by fusing hydrogen atoms into helium in their cores. This process releases enormous amounts of energy in the form of light and heat, which radiates outward through space.',
      },
      {
        title: 'Stellar Classification',
        content: 'Stars are classified by their spectral type (O, B, A, F, G, K, M) based on their temperature and color. Our Sun is a G-type main-sequence star, appearing yellow-white.',
      },
      {
        title: 'Life Cycle',
        content: 'Stars are born in nebulae, live for millions to billions of years, and die in spectacular ways - either fading as white dwarfs or exploding as supernovae, depending on their mass.',
      },
    ],
    stats: [
      { label: 'Observable Stars', value: '~200 billion trillion' },
      { label: 'Other Stars', value: '4.24 light-years (Proxima)' },
      { label: 'Temperature Range', value: '2,000 - 40,000 K' },
      { label: 'Lifespan', value: '1 million - 100 billion years' },
      { label: 'Core Pressure', value: '~250 billion atmospheres' },
      { label: 'Fusion Rate (Sun)', value: '600 million tons/second' },
    ],
  },
  {
    id: 'galaxies',
    name: 'Galaxies',
    tagline: 'Islands of Stars',
    description: 'Galaxies are vast collections of stars, gas, dust, and dark matter bound together by gravity. They come in various shapes and sizes, from spiral galaxies like our Milky Way to elliptical and irregular forms.',
    facts: [
      {
        title: 'The Milky Way',
        content: 'Our home galaxy is a barred spiral galaxy containing 200-400 billion stars. It\'s about 100,000 light-years across and our solar system is located about 27,000 light-years from the galactic center.',
      },
      {
        title: 'Types of Galaxies',
        content: 'Galaxies are classified into spiral (like the Milky Way), elliptical (spherical or oval), and irregular shapes. Each type forms through different evolutionary processes and interactions.',
      },
      {
        title: 'Supermassive Black Holes',
        content: 'Nearly all large galaxies contain supermassive black holes at their centers, millions to billions of times more massive than our Sun. These cosmic monsters influence the evolution of their host galaxies.',
      },
    ],
    stats: [
      { label: 'Observable Galaxies', value: '~2 trillion' },
      { label: 'Milky Way Mass', value: '1.5 trillion solar masses' },
      { label: 'Milky Way Diameter', value: '100,000 light-years' },
      { label: 'Nearest Galaxy', value: '25,000 ly (Canis Major Dwarf)' },
      { label: 'Stars in Milky Way', value: '200-400 billion' },
      { label: 'Galactic Rotation', value: '220 km/s (our location)' },
    ],
  },
  {
    id: 'neutron-stars',
    name: 'Neutron Stars',
    tagline: 'Cosmic Lighthouses',
    description: 'Neutron stars are the collapsed cores of massive stars, incredibly dense objects where a sugar-cube-sized amount of material would weigh billions of tons. They spin at incredible speeds and emit powerful beams of radiation.',
    facts: [
      {
        title: 'Extreme Density',
        content: 'Neutron stars are so dense that a teaspoon of their material would weigh about 6 billion tons. They pack more mass than the Sun into a sphere just 20 kilometers in diameter.',
      },
      {
        title: 'Pulsars',
        content: 'Rapidly rotating neutron stars that emit beams of electromagnetic radiation are called pulsars. These beams sweep across space like lighthouse beacons, appearing to pulse when they point toward Earth.',
      },
      {
        title: 'Formation',
        content: 'Neutron stars form when massive stars (8-20 solar masses) explode as supernovae. The core collapses so intensely that protons and electrons combine to form neutrons, creating one of the densest forms of matter.',
      },
    ],
    stats: [
      { label: 'Mass Range', value: '1.4 - 2.16 solar masses' },
      { label: 'Typical Diameter', value: '20 km' },
      { label: 'Density', value: '4 × 10¹⁷ kg/m³' },
      { label: 'Rotation Speed', value: 'Up to 716 rotations/sec' },
      { label: 'Surface Gravity', value: '2 × 10¹² m/s²' },
      { label: 'Surface Temperature', value: '~600,000 K' },
    ],
  },
  {
    id: 'black-holes',
    name: 'Black Holes',
    tagline: 'The Ultimate Abyss',
    description: 'Black holes are regions of spacetime where gravity is so strong that nothing, not even light, can escape. They form from the collapse of massive stars and warp the fabric of space and time around them.',
    facts: [
      {
        title: 'Event Horizon',
        content: 'The event horizon is the point of no return around a black hole. Once anything crosses this boundary, it cannot escape - not even light. This is why black holes appear completely black.',
      },
      {
        title: 'Time Dilation',
        content: 'Near a black hole, time slows down relative to distant observers due to extreme gravity. An observer falling into a black hole would appear to freeze at the event horizon from an outside perspective.',
      },
      {
        title: 'Types of Black Holes',
        content: 'Black holes range from stellar-mass (3-100 solar masses) formed from collapsed stars, to supermassive black holes (millions to billions of solar masses) at the centers of galaxies.',
      },
    ],
    stats: [
      { label: 'Smallest Mass', value: '~3 solar masses' },
      { label: 'Largest Known', value: '66 billion solar masses' },
      { label: 'Escape Velocity', value: 'Greater than light speed' },
      { label: 'Nearest Black Hole', value: '1,560 light-years (Gaia BH1)' },
      { label: 'Hawking Radiation', value: 'Theoretical particle emission' },
      { label: 'Singularity Density', value: 'Infinite (theoretical)' },
    ],
  },
];

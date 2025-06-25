import type { Book } from '../models/Book';

export const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Panda’s Guide to Cozy Coding',
    author: 'Ice Bear',
    summary: 'A gentle introduction to JavaScript...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Panda%27s+Guide',
    content: `# Chapter 1: The Art of Napping Between Functions

Welcome to cozy coding. Here, functions are short, breaks are long, and tea is always hot.

## Chapter 2: Let’s Write Our First Cozy Function

\`\`\`js
function nap(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
\`\`\`

Now go take a nap.
`
  },
  {
    id: '2',
    title: 'Grizz & the Great Adventure',
    author: 'Grizzly',
    summary: 'Grizz finds a map and begins a journey...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Grizz+Adventure',
    content: `# Chapter 1: The Map in the Honey Jar

Grizz dipped his paw in the honey, but something crinkled inside. It was an ancient map...

## Chapter 2: Into the Forest

Together with Panda and Ice Bear, they packed their bags and walked into the redwood trees.
`
  },
  {
    id: '3',
    title: 'Calm Thoughts by Ice Bear',
    author: 'Ice Bear',
    summary: 'Meditations and quiet musings...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Calm+Thoughts',
    content: `# Morning Silence

Sit. Breathe. Listen to snowflakes landing.

# Haiku

Snow blanket on rock  
Ice Bear blinks into the wind  
Silence speaks the most
`
  },
  {
    id: '4',
    title: 'Honey-Scented Evenings',
    author: 'Tabes',
    summary: 'Stories from the edge of the forest...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Honey+Evenings',
    content: `# Chapter 1: Patrol at Dusk

The forest hums with life. Fireflies blink near the creek. I walk slowly, my boots soft in the grass.

# Chapter 2: Marshmallow Fires

We roast. We giggle. We share secrets with the stars.
`
  },
  {
    id: '5',
    title: 'The Little Drone That Could',
    author: 'Nom Nom',
    summary: 'A drone dreams of painting sunsets...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Drone+Story',
    content: `# Page 1

Once upon a time, a delivery drone got a dent and a dream.

"I want to paint," said the drone.

Everyone laughed. But the sky didn’t.

# Page 2

So it flew higher. To find the best sunsets.
`
  },
  {
    id: '6',
    title: 'Bears in the Big City',
    author: 'Charlie',
    summary: 'Bears explore downtown San Francisco...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Big+City',
    content: `# Day 1: Churros & Chaos

Grizz bought 5 churros. Panda spilled matcha on a hipster’s dog. Ice Bear made friends with a barista.

# Day 2: Buskers and Books

We hid in a bookstore. A raccoon played ukulele. It was weird. It was perfect.
`
  },
  {
    id: '7',
    title: 'Soothing Soups & Stews',
    author: 'Chloe Park',
    summary: '35 cozy recipes for bear-cave nights...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Soups+%26+Stews',
    content: `# Cozy Lentil Stew

**Ingredients:**
- 1 cup lentils
- 2 carrots
- Garlic, thyme, love

**Steps:**
1. Simmer.
2. Watch a cozy movie.
3. Serve hot.

# Late-Night Leftover Soup

Add everything from the fridge. Simmer. Add more cheese.
`
  },
  {
    id: '8',
    title: 'Sketches from the Cave Wall',
    author: 'Panda',
    summary: 'Doodles and thoughts from the bear cave...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Sketches',
    content: `# Page 1

Comic strip of Grizz falling off a log (again).

# Page 2

Charcoal sketch: Ice Bear sleeping in fridge. Peaceful.
`
  },
  {
    id: '9',
    title: 'Mindful Hibernation',
    author: 'Ice Bear',
    summary: 'How to embrace rest in a busy world...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Hibernation',
    content: `# Chapter 1: Building the Den

Dark. Warm. Quiet. A perfect place to slow down.

# Chapter 2: Digital Hibernation

No screens after sundown. Just stars and silence.
`
  },
  {
    id: '10',
    title: 'Friendship on Four Paws',
    author: 'Grizzly, Panda & Ice Bear',
    summary: 'A shared diary of the bears’ best memories...',
    cover_url: 'https://placehold.co/300x400/FFF3CD/3E2723?text=Friendship',
    content: `# Entry 1: The Day We Met

Grizz: “I knew we’d be brothers.”

Panda: “I was skeptical, but now I’m glad.”

Ice Bear: “Confirmed. Family.”

# Entry 2: The Kitten in the Storm

We didn’t hesitate. We ran out into the rain.
We saved her. She purred the whole way home.
`
  },
];

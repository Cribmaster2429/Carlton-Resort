// The stays a reservation can be made for. Slugs are mirrored in client/src/components/stay/Stay.jsx.
export const stays = [
  { slug: "ocean-rooms", title: "Ocean Rooms" },
  { slug: "beach-suites", title: "Beach Suites" },
  { slug: "garden-villas", title: "Garden Villas" },
  { slug: "pool-villas", title: "Pool Villas" },
];

export const findStay = (slug) => stays.find((stay) => stay.slug === slug);

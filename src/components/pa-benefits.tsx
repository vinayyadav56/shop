const benefits = [
  {
    emoji: '🌬️',
    title: 'Air Purification',
    desc: 'Plants naturally filter toxins and boost oxygen levels, keeping your space fresh and clean.',
  },
  {
    emoji: '🧘',
    title: 'Stress Reduction',
    desc: 'Studies show tending to plants reduces cortisol by up to 37%. Nature heals.',
  },
  {
    emoji: '😴',
    title: 'Better Sleep',
    desc: 'Bedroom plants like lavender and peace lily create a calming atmosphere for deeper rest.',
  },
  {
    emoji: '🎨',
    title: 'Living Decor',
    desc: 'Transform any space instantly. Plants add colour, texture, and organic warmth to interiors.',
  },
  {
    emoji: '⚡',
    title: 'Productivity Boost',
    desc: 'Office plants improve focus and creativity by 15%. Work smarter, surrounded by green.',
  },
];

const PaBenefits: React.FC = () => (
  <section className="pa-benefits-section">
    <div className="pa-wrap">
      <div className="pa-sec-hdr">
        <span className="pa-pill">🌿 Science-Backed Benefits</span>
        <h2 className="pa-sec-h2">
          Why Every Home Needs <span className="pa-grad-text">Plants</span>
        </h2>
        <p className="pa-sec-sub">
          Beyond beauty — plants actively improve your air quality, mental health, and daily life.
        </p>
      </div>

      <div className="pa-benefits-grid">
        {benefits.map((b) => (
          <div key={b.title} className="pa-benefit-card">
            <div className="pa-benefit-icon">
              <span role="img" aria-label={b.title}>{b.emoji}</span>
            </div>
            <h3 className="pa-benefit-title">{b.title}</h3>
            <p className="pa-benefit-desc">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PaBenefits;

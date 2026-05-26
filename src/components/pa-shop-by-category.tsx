import { useCategories } from '@/framework/category';
import { Image } from '@/components/ui/image';
import Link from '@/components/ui/link';

interface Props {
  variables: any;
}

function getEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('succulent') || n.includes('cactus')) return '🌵';
  if (n.includes('flower') || n.includes('bloom') || n.includes('rose') || n.includes('hibiscus')) return '🌺';
  if (n.includes('herb') || n.includes('basil') || n.includes('mint') || n.includes('tulsi')) return '🌱';
  if (n.includes('tree') || n.includes('outdoor') || n.includes('garden')) return '🌳';
  if (n.includes('indoor') || n.includes('foliage') || n.includes('fern') || n.includes('tropical')) return '🪴';
  if (n.includes('seed') || n.includes('bulb')) return '🌾';
  if (n.includes('fruit') || n.includes('veggie') || n.includes('vegetable')) return '🍃';
  return '🌿';
}

const PaShopByCategory: React.FC<Props> = ({ variables }) => {
  const { categories, isLoading } = useCategories(variables);
  const rootCats = categories?.filter((c: any) => !c.parent_id)?.slice(0, 8) ?? [];

  if (isLoading || !rootCats.length) return null;

  return (
    <section className="pa-cat-section">
      <div className="pa-wrap">
        <div className="pa-sec-hdr">
          <span className="pa-pill">🌿 Browse Collections</span>
          <h2 className="pa-sec-h2">
            Shop by <span className="pa-grad-text">Collection</span>
          </h2>
          <p className="pa-sec-sub">
            Carefully curated botanical categories for every plant lover
          </p>
        </div>

        <div className="pa-cat-grid">
          {rootCats.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/${cat.type?.slug ?? 'grocery'}/search/?category=${cat.slug}`}
              className="pa-cat-card group"
            >
              {/* Background image overlay */}
              {cat.image?.original && (
                <div className="pa-cat-img-wrap">
                  <Image
                    src={cat.image.original}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="pa-cat-img"
                  />
                  <div className="pa-cat-img-overlay" />
                </div>
              )}

              {/* Content */}
              <div className="pa-cat-body">
                {!cat.image?.original && (
                  <span className="pa-cat-emoji">{getEmoji(cat.name)}</span>
                )}
                <div className="pa-cat-name">{cat.name}</div>
                {cat.products_count > 0 && (
                  <div className="pa-cat-count">{cat.products_count} plants</div>
                )}
              </div>

              {/* Arrow */}
              <div className="pa-cat-arr">
                <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaShopByCategory;

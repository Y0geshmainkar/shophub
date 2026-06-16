import styles from './Hero.module.scss';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600';

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Promo banner">
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            Find the Perfect Gift<br />for Every Occasion
          </h1>
          <p className={styles.sub}>
            Discover unique and thoughtful gifts that will make your loved ones smile.
            From personalized treasures to timeless classics, we have something special for everyone.
          </p>
          <div className={styles.actions}>
            <a href="#catalog" className={styles.btnPrimary}>Shop Now</a>
            <a href="#catalog" className={styles.btnSecondary}>Gift Guide</a>
          </div>
        </div>
        <div className={styles.imageWrap}>
          <img src={HERO_IMAGE} alt="Wrapped gift with gold ribbon" className={styles.image} />
        </div>
      </div>
    </section>
  );
}

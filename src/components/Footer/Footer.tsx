import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>
              <span>🎁</span>
              <span className={styles.brandName}>ShopHub</span>
            </div>
            <p className={styles.tagline}>
              Your one-stop destination for thoughtful gifts that create lasting memories.
            </p>
          </div>

          <div>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.links}>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Gift Guide</a></li>
              <li><a href="#">Custom Orders</a></li>
              <li><a href="#">Track Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Customer Service</h4>
            <ul className={styles.links}>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Stay Updated</h4>
            <p className={styles.newsletterText}>
              Get exclusive offers and gift ideas delivered to your inbox.
            </p>
            <div className={styles.subscribe}>
              <input type="email" placeholder="Enter your email" className={styles.emailInput} aria-label="Email for newsletter" />
              <button className={styles.subscribeBtn}>Subscribe</button>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.contact}>
            <span>📍 123 Gift Street, Present City</span>
            <span>📞 (555) 123-GIFT</span>
            <span>✉ hello@shophub.com</span>
          </div>
          <span className={styles.love}>Made with ❤️ for gift lovers</span>
        </div>

        <p className={styles.copyright}>© 2026 ShopHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

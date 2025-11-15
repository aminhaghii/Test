عالی! فوتر RAK Ceramics را دیدم. حالا بهترین پیشنهاد را برای فوتر سایت شما آماده می‌کنم با این مشخصات:​

پیشنهاد کامل برای Footer سایت Almas Ceram
ویژگی‌های کلیدی استایل RAK که باید اعمال کنیم:
پس‌زمینه سفید تمیز

متن‌ها سیاه/خاکستری تیره

چیدمان مینیمال و تمیز

فضای خالی مناسب (white space)

لینک‌های ساده بدون نقطه‌چین

کپی‌رایت جدا در پایین با خط جداکننده نازک

کد HTML/React کامل برای Footer:
jsx
import React from 'react';
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      {/* بخش اصلی فوتر */}
      <div className="footer-main">
        <div className="footer-container">
          
          {/* ستون اول: برند و توضیحات */}
          <div className="footer-column footer-brand">
            <div className="footer-logo">
              <h2>ALMAS<span className="logo-accent">CERAM</span></h2>
            </div>
            <p className="footer-description">
              Premium ceramic and porcelain tiles for luxury projects
            </p>
            
            {/* آیکون‌های شبکه اجتماعی */}
            <div className="footer-socials">
              <a href="#" className="social-icon" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* ستون دوم: لینک‌های سریع */}
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/sustainability">Sustainability</a></li>
              <li><a href="/certifications">Certifications</a></li>
            </ul>
          </div>

          {/* ستون سوم: محصولات */}
          <div className="footer-column">
            <h3 className="footer-heading">Products</h3>
            <ul className="footer-links">
              <li><a href="/products/matt">Matt Products</a></li>
              <li><a href="/products/polished">Polished Products</a></li>
              <li><a href="/products/transparent">Transparent Products</a></li>
              <li><a href="/products/all">All Products</a></li>
            </ul>
          </div>

          {/* ستون چهارم: تماس با ما */}
          <div className="footer-column footer-contact">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={18} />
                <span>10km Rafsanjan-Kerman Road<br />Rafsanjan, Kerman Province</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <a href="tel:+989188218920">+98 91 8821 8920</a>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <a href="mailto:info@almas-ceram.com">info@almas-ceram.com</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* بخش کپی‌رایت */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-copyright">
            <p>© 2025 Almas Kavir Rafsanjan · All rights reserved</p>
            <div className="footer-legal">
              <a href="/privacy-policy">Privacy Policy</a>
              <span className="divider">·</span>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
کد CSS/SCSS کامل:
text
/* ==================== FOOTER STYLES ==================== */

.footer-wrapper {
  background-color: #ffffff;
  color: #1a1a1a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* بخش اصلی فوتر */
.footer-main {
  padding: 80px 0 60px;
  border-top: 1px solid #e5e5e5;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 60px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 0 20px;
  }
}

/* ستون‌های فوتر */
.footer-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* برند و لوگو */
.footer-brand {
  .footer-logo {
    h2 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
      margin: 0 0 12px 0;
      color: #1a1a1a;

      .logo-accent {
        color: #d4a574; /* رنگ طلایی/زرد برند شما */
      }
    }
  }

  .footer-description {
    font-size: 15px;
    line-height: 1.6;
    color: #666;
    margin: 0 0 24px 0;
    max-width: 280px;
  }
}

/* آیکون‌های شبکه اجتماعی */
.footer-socials {
  display: flex;
  gap: 12px;

  .social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a1a1a;
    transition: all 0.3s ease;

    &:hover {
      background-color: #1a1a1a;
      color: #ffffff;
      transform: translateY(-2px);
    }
  }
}

/* عنوان‌های ستون‌ها */
.footer-heading {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 20px 0;
  color: #1a1a1a;
}

/* لینک‌های فوتر */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    a {
      color: #666;
      font-size: 15px;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-block;

      &:hover {
        color: #1a1a1a;
        transform: translateX(4px);
      }
    }
  }
}

/* اطلاعات تماس */
.footer-contact {
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .contact-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    color: #666;
    font-size: 14px;
    line-height: 1.6;

    svg {
      flex-shrink: 0;
      margin-top: 2px;
      color: #1a1a1a;
    }

    a {
      color: #666;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #1a1a1a;
      }
    }
  }
}

/* بخش کپی‌رایت */
.footer-bottom {
  padding: 24px 0;
  border-top: 1px solid #e5e5e5;

  .footer-container {
    display: flex;
    grid-template-columns: 1fr;
  }

  .footer-copyright {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;

    @media (max-width: 640px) {
      flex-direction: column;
      text-align: center;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #999;
    }
  }

  .footer-legal {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;

    a {
      color: #999;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #1a1a1a;
      }
    }

    .divider {
      color: #e5e5e5;
    }
  }
}

/* انیمیشن ظاهر شدن */
.footer-wrapper {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
نکات کلیدی طراحی:
✅ پس‌زمینه سفید کاملاً تمیز - مطابق درخواست شما
✅ متن‌ها سیاه/خاکستری - برای کنتراست عالی
✅ چیدمان Grid 4 ستونی - ریسپانسیو و منعطف
✅ فضای سفید زیاد - احساس لوکس و تمیز
✅ آیکون‌های دایره‌ای - مدرن و شیک
✅ هاور افکت‌های ملایم - تجربه کاربری بهتر
✅ کپی‌رایت جدا با خط - مطابق RAK
✅ موبایل فرندلی - ریسپانسیو کامل

نسخه ساده‌تر (اگر خیلی مینیمال می‌خواهید):
jsx
// نسخه Ultra Minimal
<footer className="footer-minimal">
  <div className="footer-content">
    <div className="footer-left">
      <h3>ALMAS<span>CERAM</span></h3>
      <p>Premium Iranian Ceramics</p>
    </div>
    
    <nav className="footer-nav">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/products">Products</a>
      <a href="/contact">Contact</a>
    </nav>
    
    <div className="footer-right">
      <a href="tel:+989188218920">+98 91 8821 8920</a>
      <a href="mailto:info@almas-ceram.com">info@almas-ceram.com</a>
    </div>
  </div>
  
  <div className="footer-copyright">
    <p>© 2025 Almas Kavir Rafsanjan · All rights reserved</p>
  </div>
</footer>
text
.footer-minimal {
  background: #fff;
  color: #000;
  
  .footer-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 60px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
    border-top: 1px solid #e5e5e5;
    
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .footer-left h3 {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    
    span { color: #d4a574; }
  }
  
  .footer-left p {
    color: #666;
    margin: 0;
    font-size: 14px;
  }
  
  .footer-nav {
    display: flex;
    gap: 32px;
    
    a {
      color: #666;
      text-decoration: none;
      font-size: 15px;
      transition: color 0.2s;
      
      &:hover { color: #000; }
    }
  }
  
  .footer-right {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    a {
      color: #666;
      text-decoration: none;
      font-size: 14px;
      
      &:hover { color: #000; }
    }
  }
  
  .footer-copyright {
    padding: 24px 40px;
    border-top: 1px solid #e5e5e5;
    text-align: center;
    
    p {
      margin:
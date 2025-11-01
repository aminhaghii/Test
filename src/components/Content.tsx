import React from 'react';

const Content: React.FC = () => {
  return (
    <div className="content-container">
      <header className="content-header">
        <h1>کرسر سفارشی کرم رنگ</h1>
        <p>این کرسر انیمیشن دار و زیبا است</p>
      </header>

      <main className="content-main">
        <section className="interactive-section">
          <h2>عناصر تعاملی</h2>
          
          <div className="buttons-container">
            <button className="cream-button">دکمه اول</button>
            <button className="cream-button">دکمه دوم</button>
            <button className="cream-button">دکمه سوم</button>
          </div>

          <div className="links-container">
            <a href="#" className="cream-link">لینک اول</a>
            <a href="#" className="cream-link">لینک دوم</a>
            <a href="#" className="cream-link">لینک سوم</a>
          </div>

          <div className="cards-container">
            <div className="cream-card clickable">
              <h3>کارت اول</h3>
              <p>این کارت قابل کلیک است</p>
            </div>
            <div className="cream-card clickable">
              <h3>کارت دوم</h3>
              <p>این کارت هم قابل کلیک است</p>
            </div>
            <div className="cream-card clickable">
              <h3>کارت سوم</h3>
              <p>کرسر روی این کارت تغییر می‌کند</p>
            </div>
          </div>
        </section>

        <section className="text-section">
          <h2>متن عادی</h2>
          <p>
            این متن برای نمایش کرسر عادی است. وقتی موس روی این متن حرکت می‌کند،
            کرسر به حالت عادی خود باقی می‌ماند.
          </p>
          <p>
            کرسر کرم رنگ ما دارای انیمیشن‌های نرم و زیبا است که تجربه کاربری
            را بهبود می‌بخشد.
          </p>
        </section>
      </main>

      <footer className="content-footer">
        <p>© 2024 - کرسر سفارشی با React</p>
      </footer>
    </div>
  );
};

export default Content;
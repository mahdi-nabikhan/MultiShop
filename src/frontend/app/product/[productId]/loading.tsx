import "./loading.css";

export default function ProductDetailLoading() {
  return (
    <section className="product-loading container">

      <div className="loading-gallery">

        <div className="loading-thumbnails">
          <div className="skeleton thumbnail"></div>
          <div className="skeleton thumbnail"></div>
          <div className="skeleton thumbnail"></div>
          <div className="skeleton thumbnail"></div>
        </div>

        <div className="skeleton main-image"></div>

      </div>

      <div className="loading-info">

        <div className="skeleton title"></div>

        <div className="skeleton rating"></div>

        <div className="skeleton price"></div>

        <div className="skeleton line"></div>
        <div className="skeleton line"></div>
        <div className="skeleton line short"></div>

        <div className="skeleton stock"></div>

        <div className="loading-quantity">
          <div className="skeleton qty-btn"></div>
          <div className="skeleton qty-number"></div>
          <div className="skeleton qty-btn"></div>
        </div>

        <div className="skeleton button"></div>

        <div className="loading-features">
          <div className="skeleton feature"></div>
          <div className="skeleton feature"></div>
        </div>

      </div>

    </section>
  );
}
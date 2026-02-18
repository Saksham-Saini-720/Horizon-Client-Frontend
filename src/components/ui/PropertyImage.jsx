
import { useState, useCallback, memo } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=60";

const PropertyImage = memo(({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = useCallback(() => {
    setImgSrc(FALLBACK);
  }, []);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
});

export default PropertyImage;

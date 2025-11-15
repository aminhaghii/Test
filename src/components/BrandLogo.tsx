import type { ImgHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { getApiUrl } from '@/lib/getApiUrl';
import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();
const LOGO_FILENAME = "ALMAS CERAM.png";
const LOGO_URL = getImageUrl(`/ALMAS/${encodeURIComponent(LOGO_FILENAME)}`);

export const brandLogoUrl = LOGO_URL;

export type BrandLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  /**
   * Whether to disable native lazy loading.
   * Defaults to lazy for non-critical placements.
   */
  eager?: boolean;
};

const BrandLogo = ({
  className,
  eager,
  alt,
  loading,
  ...rest
}: BrandLogoProps) => {
  const resolvedLoading = eager ? "eager" : loading ?? "lazy";

  return (
    <img
      src={brandLogoUrl}
      alt={alt ?? "Almas Ceram logo"}
      loading={resolvedLoading}
      className={cn("block object-contain", className)}
      {...rest}
    />
  );
};

export default BrandLogo;


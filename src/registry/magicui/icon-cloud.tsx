"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
    dragControl: true,
  },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (e: any) => e.preventDefault(),
    },
  });
};

export type DynamicCloudProps = {
  iconSlugs?: string[];
  imageArray?: string[];
  images?: string[];
};

export function IconCloud({
  iconSlugs,
  imageArray,
  images,
}: DynamicCloudProps) {
  const [data, setData] = useState<{ simpleIcons: Record<string, SimpleIcon> }>();
  const { theme } = useTheme();

  useEffect(() => {
    if (iconSlugs) {
      fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
    }
  }, [iconSlugs]);

  const renderedIcons = useMemo(() => {
    if (!data) return null;

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, theme || "light"),
    );
  }, [data, theme]);

  return (
    <Cloud {...cloudProps}>
      {renderedIcons}
      {imageArray &&
        imageArray.map((image, index) => (
          <a key={index} href="#" onClick={(e) => e.preventDefault()}>
            <img height="42" width="42" alt="A tech icon" src={image} draggable={false} style={{ pointerEvents: 'none' }} />
          </a>
        ))}
      {images &&
        images.map((image, index) => (
          <a key={index} href="#" onClick={(e) => e.preventDefault()}>
            <img height="42" width="42" alt="A tech icon" src={image} draggable={false} style={{ pointerEvents: 'none' }} />
          </a>
        ))}
    </Cloud>
  );
}

import { Background } from "@/ui/components";

export const PageBackground = () => {
  return (
    <>
      <Background
        mask={{
          x: 80,
          y: 0,
          radius: 100,
        }}
        position="absolute"
        gradient={{
          display: true,
          tilt: -35,
          height: 50,
          width: 75,
          x: 100,
          y: 40,
          colorStart: "accent-solid-medium",
          colorEnd: "static-transparent",
        }}
      />
      <Background
        mask={{
          x: 100,
          y: 0,
          radius: 100,
        }}
        position="absolute"
        gradient={{
          display: true,
          opacity: 100,
          tilt: -35,
          height: 20,
          width: 120,
          x: 120,
          y: 35,
          colorStart: "brand-solid-strong",
          colorEnd: "static-transparent",
        }}
      />
    </>
  );
};
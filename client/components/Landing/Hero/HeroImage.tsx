import Image from "next/image";

type HeroImageProps = {
  lightBanner?: string;
  darkBanner?: string;
};

export default function HeroImage({
  lightBanner,
  darkBanner,
}: HeroImageProps) {
  return (
    <div
      className="
        relative
        flex
        items-start
        justify-center
        lg:pt-0
      ">
      <div
        className="
          relative
          w-full
          max-w-[560px]
          overflow-hidden
          [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]
          [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]
        ">
        {/* Light Image */}
        <Image
          src={lightBanner || "/Banner-image-light.jpg"}
          alt="Learning platform"
          width={900}
          height={700}
          priority
          className="
            block
            h-auto
            w-full
            object-contain
            dark:hidden
          "
        />

        {/* Dark Image */}
        <Image
          src={darkBanner || "/Banner-image-dark.jpg"}
          alt="Learning platform"
          width={900}
          height={700}
          priority
          className="
            hidden
            h-auto
            w-full
            object-contain
            dark:block
          "
        />

        {/* Bottom Fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-[40%]
            bg-gradient-to-b
            from-transparent
            via-background/40
            to-background
          "
        />

        {/* Left Fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            w-16
            bg-gradient-to-r
            from-background
            to-transparent
          "
        />

        {/* Right Fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            w-16
            bg-gradient-to-l
            from-background
            to-transparent
          "
        />

        {/* Top Fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-10
            bg-gradient-to-b
            from-background/20
            to-transparent
          "
        />
      </div>
    </div>
  );
}
import Image from "next/image"

export function LogoMark() {
  return (
    <Image
      src="/img/shared/brand/zitrone-logo-white.svg"
      alt=""
      width={36}
      height={36}
      unoptimized
    />
  )
}

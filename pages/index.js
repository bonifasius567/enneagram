import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="figmaLandingWrapper">
      <div className="lblob1"></div>
      <div className="lblob2"></div>
      <div className="lblob3"></div>
      <div className="lblob4"></div>

      <div className="figmaLandingContent">
        <div className="figmaLandingLogoWrap">
          <div className="figmaLogoBadge">
            <div className="figmaLogoBadgeInner">ENNEAGRAM</div>
          </div>
        </div>

        <h1 className="figmaLandingTitle">
          Kenali Tipe Kepribadian
          <br />
          Enneagram Anda
        </h1>

        <div className="figmaLandingCard">
          <p className="figmaLandingSubtitle">
            Kenali tipe kepribadian Anda melalui tes sederhana yang cepat
            dan intuitif.
          </p>

          <div className="figmaLandingButtonGroup">
            <Link href="/login" className="pillButton">
              Login
            </Link>

            <Link href="/register" className="pillButtonSecondary">
              Register
            </Link>
          </div>
        </div>

        {/* <Link href="/test" className="figmaLandingLinkTest">
          Atau langsung mulai tes →
        </Link> */}
      </div>
    </div>
  );
}
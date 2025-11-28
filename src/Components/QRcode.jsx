import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QRcode({ value, size = 180 }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    QRCode.toCanvas(
      ref.current,
      value,
      { width: size, errorCorrectionLevel: "M" },
      err => err && console.error(err)
    );
  }, [value, size]);

  return <canvas ref={ref} />;
}
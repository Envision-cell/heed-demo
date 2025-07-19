// src/components/RotatePrompt.js
import React from "react";
import { createPortal } from "react-dom";
import "./RotatePrompt.css";
import rotateIcon from "../assets/phone.png";   // ← your image here

/**
 * Renders a full‑screen “rotate device” overlay in PORTAL,
 * so it’s a direct child of <body> (highest z‑index wins).
 */
export default function RotatePrompt() {
  return createPortal(
    <div className="rotate-prompt">
      <img src={rotateIcon} alt="" />
      <p>Please rotate your device to landscape mode</p>
    </div>,
    document.body
  );
}

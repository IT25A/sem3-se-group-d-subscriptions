import { useEffect, useState } from "react";
import megaphoneIcon from "../../assets/megaphone.svg";

export function Notification({ message, onDone }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!message) return;

    setText(message);
    const showTimer = requestAnimationFrame(() => setVisible(true));
    const hideTimer = setTimeout(() => setVisible(false), 5000);
    const doneTimer = setTimeout(() => { setText(""); onDone?.(); }, 5400);

    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [message]);

  return (
    <div className={`notification${visible ? " notification--visible" : ""}`}>
      <img src={megaphoneIcon} alt="" className="icon icon-white" />
      {text}
    </div>
  );
}
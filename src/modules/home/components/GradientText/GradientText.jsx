import "./GradientText.css";

export default function GradientText({
  children,
  className = "",
  colors = ["#212121", "#C10007", "#212121", "#C10007", "#212121"],
  animationSpeed = 8,
  showBorder = false,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className={`animated-gradient-text  ${className} `}>
      {showBorder && (
        <div className="gradient-overlay" style={gradientStyle}></div>
      )}
      <div
        className="text-content text-4xl md:px-16 md:py-5 py-4"
        style={gradientStyle}
      >
        {children}
      </div>
    </div>
  );
}

import Hero from "../../../models/hero/Hero";
import HeroItem from "../hero-item/HeroItem";
import "./hero-container.scss";

type HeroContainerProps = {
  hero: Hero;
};

const HeroContainer = ({ hero }: HeroContainerProps) => {
  return (
    <div className="hero-container">
      <HeroItem hero={hero} />
    </div>
  );
};

export default HeroContainer;

import Hero from "../../../../../models/hero/Hero";
import HeroItem from "../../../../shared/HeroItem";
import "./dwelling-habitant.scss";

type DwellingHabitantProps = {
  habitant: Hero;
};

const DwellingHabitant = ({ habitant }: DwellingHabitantProps) => {
  return (
    <div className="dwelling-habitant">
      <HeroItem hero={habitant} />
    </div>
  );
};

export default DwellingHabitant;

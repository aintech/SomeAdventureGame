import ActorItem, { ActorItemType } from "../actor-item/ActorItem";
import "./actor-item-list.scss";

type ActorItemListProps = {
  actors: ActorItemType[];
};

const ActorItemList = ({ actors }: ActorItemListProps) => {
  return (
    <div className="actor-item-list">
      <div className="actor-item-list__heroes">
        {actors
          .filter((a) => a.isHero)
          .map((a) => (
            <ActorItem key={`${a.actorId} ${a.isHero}`} actor={a} />
          ))}
      </div>
      <div className="actor-item-list__opponents">
        {actors
          .filter((a) => !a.isHero)
          .map((a) => (
            <ActorItem key={`${a.actorId} ${a.isHero}`} actor={a} />
          ))}
      </div>
    </div>
  );
};

export default ActorItemList;

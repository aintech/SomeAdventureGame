import noimageImg from "../../../../../img/equipment/equipment-weapon-no_image.png";
import Item, { ItemSubtype } from "../../../../../models/Item";
import "./alchemist-item.scss";

type AlchemistItemProps = {
  item: Item;
};

export const AlchemistItem = ({ item }: AlchemistItemProps) => {
  return (
    <li className="alchemist-item">
      <img src={getImage(item.subtype)} alt={item.name} className="alchemist-item__img"></img>
      <div className="alchemist-item__name">{item.name}</div>
      <div className="alchemist-item__description">{item.description}</div>
      <div className="alchemist-item__price">{item.price} g</div>
    </li>
  );
};

const getImage = (type: ItemSubtype) => {
  switch (type) {
    default:
      return noimageImg;
  }
};

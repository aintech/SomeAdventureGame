import healingElixirImg from '../../../../../img/items/healing_elixir.png';
import healingPotionImg from '../../../../../img/items/healing_potion.png';
import maanPotionImg from '../../../../../img/items/mana_potion.png';
import Item, { ItemSubtype } from '../../../../../models/Item';
import './alchemist-item.scss';

type AlchemistItemProps = {
  item: Item;
};

export const AlchemistItem = ({ item }: AlchemistItemProps) => {
  return (
    <li className="alchemist-item">
      <img src={getImage(item.subtype)} alt={item.name} className="alchemist-item__img"></img>
      <div className="alchemist-item__name">{item.name}</div>
      <div className="alchemist-item__description">{item.description}</div>
      <div className="alchemist-item__price">{item.price}</div>
    </li>
  );
};

export const getImage = (type: ItemSubtype) => {
  switch (type) {
    case ItemSubtype.HEALTH_POTION:
      return healingPotionImg;
    case ItemSubtype.HEALTH_ELIXIR:
      return healingElixirImg;

    case ItemSubtype.MANA_POTION:
      return maanPotionImg;

    default:
      throw new Error(`Unknown item subtype ${ItemSubtype[type]}`);
  }
};

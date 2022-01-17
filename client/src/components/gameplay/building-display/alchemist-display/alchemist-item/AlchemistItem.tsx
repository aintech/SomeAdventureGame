import healthElixirImg from '../../../../../img/items/health_elixir.png';
import healthPotionImg from '../../../../../img/items/health_potion.png';
import manaElixirImg from '../../../../../img/items/mana_elixir.png';
import manaPotionImg from '../../../../../img/items/mana_potion.png';
import wandFireballImg from '../../../../../img/items/wand_fireball.png';
import wandStunImg from '../../../../../img/items/wand_stun.png';
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
      return healthPotionImg;
    case ItemSubtype.HEALTH_ELIXIR:
      return healthElixirImg;

    case ItemSubtype.MANA_POTION:
      return manaPotionImg;
    case ItemSubtype.MANA_ELIXIR:
      return manaElixirImg;

    case ItemSubtype.WAND_FIREBALL:
      return wandFireballImg;
    case ItemSubtype.WAND_STUN:
      return wandStunImg;

    default:
      throw new Error(`Unknown item subtype ${ItemSubtype[type]}`);
  }
};

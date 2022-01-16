import leatherJacketImg from '../../../../../img/equipment/leather_jacket.png';
import simpleRobeImg from '../../../../../img/equipment/simple_robe.png';
import simpleShirtImg from '../../../../../img/equipment/simple_shirt.png';
import bentStaffImg from '../../../../../img/equipment/bent_staff.png';
import bronzeSwordImg from '../../../../../img/equipment/bronze_sword.png';
import oldDaggerImg from '../../../../../img/equipment/old_dagger.png';
import rustySwordImg from '../../../../../img/equipment/rusty_sword.png';
import steelSwordImg from '../../../../../img/equipment/steel_sword.png';
import woodenStaffImg from '../../../../../img/equipment/wooden_staff.png';
import Equipment, { EquipmentSubtype } from '../../../../../models/Equipment';
import './market-item.scss';

type MarketItemProps = {
  item: Equipment;
};

export const MarketItem = ({ item }: MarketItemProps) => {
  let stats = '';
  if (item.stats.power > 0) {
    stats += `ATK +${item.stats.power}, `;
  }
  if (item.stats.defence > 0) {
    stats += `DEF +${item.stats.defence}, `;
  }
  //TODO: добавить wizdom в статы
  if (item.stats.vitality > 0) {
    stats += `WIZ +${item.stats.vitality}, `;
  }
  if (item.stats.vitality > 0) {
    stats += `VIT +${item.stats.vitality}, `;
  }
  if (item.stats.initiative > 0) {
    stats += `AGI +${item.stats.initiative}, `;
  }

  stats = stats.substring(0, stats.length - 2);

  return (
    <li className="market-item">
      <img className="market-item__img" src={getImage(item.subtype)} alt={item.name}></img>
      <div className="market-item__name">{item.name}</div>
      <div className="market-item__stats">{stats}</div>
      <div className="market-item__price">{item.price}</div>
    </li>
  );
};

export const getImage = (type: EquipmentSubtype) => {
  switch (type) {
    case EquipmentSubtype.RUSTY_SWORD:
      return rustySwordImg;
    case EquipmentSubtype.BRONZE_SWORD:
      return bronzeSwordImg;
    case EquipmentSubtype.STEEL_SWORD:
      return steelSwordImg;

    case EquipmentSubtype.OLD_DAGGER:
      return oldDaggerImg;

    case EquipmentSubtype.BENT_STAFF:
      return bentStaffImg;
    case EquipmentSubtype.WOODEN_STAFF:
      return woodenStaffImg;

    case EquipmentSubtype.SIMPLE_SHIRT:
      return simpleShirtImg;
    case EquipmentSubtype.SIMPLE_ROBE:
      return simpleRobeImg;
    case EquipmentSubtype.LEATHER_JACKET:
      return leatherJacketImg;

    default:
      throw new Error(`Unknown equipment subtype ${EquipmentSubtype[type]}`);
  }
};

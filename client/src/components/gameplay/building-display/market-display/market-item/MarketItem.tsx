import simpleShirtImg from "../../../../../img/equipment/equipment-armor-simple_shirt.png";
import bentStaffImg from "../../../../../img/equipment/equipment-weapon-bent_staff.png";
import noimageImg from "../../../../../img/equipment/equipment-weapon-no_image.png";
import rustySwordImg from "../../../../../img/equipment/equipment-weapon-rusty_sword.png";
import Equipment, { EquipmentSubtype } from "../../../../../models/Equipment";
import "./market-item.scss";

type MarketItemProps = {
  item: Equipment;
};

export const MarketItem = ({ item }: MarketItemProps) => {
  let stats = "";
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

const getImage = (type: EquipmentSubtype) => {
  switch (type) {
    case EquipmentSubtype.RUSTY_SWORD:
      return rustySwordImg;
    case EquipmentSubtype.BENT_STAFF:
      return bentStaffImg;
    case EquipmentSubtype.SIMPLE_SHIRT:
      return simpleShirtImg;
    default:
      return noimageImg;
  }
};

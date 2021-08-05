import simpleShirtImg from "../../../../img/equipment/equipment-armor-simple_shirt.png";
import bentStaffImg from "../../../../img/equipment/equipment-weapon-bent_staff.png";
import noimageImg from "../../../../img/equipment/equipment-weapon-no_image.png";
import rustySwordImg from "../../../../img/equipment/equipment-weapon-rusty_sword.png";
import Equipment, { EquipmentSubtype } from "../../../../models/Equipment";
import "./market-item.scss";

type MarketItemProps = {
  item: Equipment;
};

export const MarketItem = ({ item }: MarketItemProps) => {
  // const imgSrc =

  return (
    <li className="market-item">
      <img src={getImage(item.subtype)} alt={item.name} className="market-item__img"></img>
      <div className="market-item__name">{item.name}</div>
      <div className="market-item__power">с. {item.stats.power}</div>
      <div className="market-item__defence">з. {item.stats.defence}</div>
      <div className="market-item__vitality">в. {item.stats.vitality}</div>
      <div className="market-item__initiative">и. {item.stats.initiative}</div>
      <div className="market-item__price">{item.price} g</div>
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
